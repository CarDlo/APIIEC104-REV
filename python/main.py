import multiprocessing
import signal
import time
import os
import json
from plant_service import fetch_plants
from clients.iec104_client import start_iec104_client
from clients.modbus_client import start_modbus_client

# Archivos de bloqueo y estado
LOCK_FILE = "plants.lock"
PROCESS_STATE_FILE = "process_state.json"

# Diccionario global para rastrear procesos
processes = {}

def check_file_permissions(file_path):
    """Verifica los permisos de lectura y escritura de un archivo."""
    if not os.path.exists(file_path):
        print(f"El archivo {file_path} no existe.")
        return False
    if not os.access(file_path, os.R_OK):
        print(f"No tienes permisos de lectura en {file_path}")
        return False
    if not os.access(file_path, os.W_OK):
        print(f"No tienes permisos de escritura en {file_path}")
        return False
    print(f"Tienes permisos de lectura y escritura en {file_path}")
    return True

def load_active_plants():
    """Carga las plantas activas desde el archivo de bloqueo."""
    if not check_file_permissions(LOCK_FILE):
        return set()
    if os.path.exists(LOCK_FILE):
        with open(LOCK_FILE, "r") as f:
            active_plants = set(json.load(f))
            print(f"Loaded active plants: {active_plants}")
            return active_plants
    return set()

def save_active_plants(active_plants):
    """Guarda las plantas activas en el archivo de bloqueo."""
    if not check_file_permissions(LOCK_FILE):
        return
    with open(LOCK_FILE, "w") as f:
        json.dump(list(active_plants), f)
        print(f"Saved active plants: {active_plants}")

def load_process_state():
    """Carga el estado de los procesos desde el archivo."""
    if not check_file_permissions(PROCESS_STATE_FILE):
        return {}
    if os.path.exists(PROCESS_STATE_FILE):
        with open(PROCESS_STATE_FILE, "r") as f:
            process_state = json.load(f)
            print(f"Loaded process state: {process_state}")
            return process_state
    return {}

def save_process_state(state):
    """Guarda el estado de los procesos en el archivo."""
    if not check_file_permissions(PROCESS_STATE_FILE):
        return
    with open(PROCESS_STATE_FILE, "w") as f:
        json.dump(state, f)
        print(f"Saved process state: {state}")

def handle_plant(plant):
    """
    Maneja el procesamiento de una planta según su protocolo de comunicación.
    """
    protocolo = plant["protocoloComunicacion"]
    ip = plant["ip"]
    port = int(plant["puerto"])
    api_url = plant["apiUrl"]

    metadata = plant.get("metadata", {})
    if not isinstance(metadata, dict):
        metadata = {}

    print(f"Iniciando cliente para planta: {plant['name']} con protocolo {protocolo}")

    if protocolo == "IEC104":
        tick_rate_ms = metadata.get("tick_rate_ms", 5000)
        command_timeout_ms = metadata.get("command_timeout_ms", 5000)
        time_sender_sleep_s = metadata.get("time_sender_sleep_ms", 5000) / 1000
        originator_address = metadata.get("originator_address", 123)
        time_connect_s = metadata.get("time_connect_ms", 1000) / 1000

        start_iec104_client(ip, port, api_url, tick_rate_ms, command_timeout_ms, time_sender_sleep_s, originator_address, time_connect_s)

    elif protocolo == "MODBUS":
        start_address = metadata.get("start_address", 0)
        max_registers = metadata.get("max_registers", 10)
        interval = metadata.get("interval", 5)

        start_modbus_client(ip, port, start_address, max_registers, interval, api_url)

    else:
        print(f"Protocolo desconocido para la planta: {plant['name']}")

    stop_flag = False

    def terminate_process(signal_number, frame):
        nonlocal stop_flag
        print(f"Cliente para {plant['name']} recibiendo señal de terminación.")
        stop_flag = True

    signal.signal(signal.SIGTERM, terminate_process)

    try:
        while not stop_flag:
            print(f"Cliente {plant['name']} trabajando...")
            time.sleep(5)
        print(f"Cliente para {plant['name']} finalizado correctamente.")
    except KeyboardInterrupt:
        print(f"Cliente para {plant['name']} detenido manualmente.")

def start_client(plant_name):
    """
    Inicia un cliente para una planta específica.
    """
    active_plants = load_active_plants()
    process_state = load_process_state()

    print(f"Estado de los procesos: {process_state}")

    if plant_name in process_state:
        return {"status": "error", "message": f"La planta {plant_name} ya está en ejecución."}

    plants = fetch_plants()
    plant = next((p for p in plants if p["name"] == plant_name), None)

    if not plant:
        return {"status": "error", "message": f"Planta {plant_name} no encontrada."}

    process = multiprocessing.Process(target=handle_plant, args=(plant,))
    process.start()

    process_state[plant_name] = process.pid
    save_process_state(process_state)

    active_plants.add(plant_name)
    save_active_plants(active_plants)

    return {"status": "success", "message": f"Cliente iniciado para la planta: {plant_name}", "pid": process.pid}

def stop_client(plant_name):
    """
    Detiene un cliente para una planta específica.
    """
    active_plants = load_active_plants()
    process_state = load_process_state()

    pid = process_state.get(plant_name)
    if not pid:
        return {"status": "error", "message": f"No hay cliente activo para la planta: {plant_name}"}

    try:
        os.kill(pid, signal.SIGTERM)
    except OSError as e:
        return {"status": "error", "message": f"Error al detener el cliente {plant_name}: {e}"}

    process_state.pop(plant_name, None)
    save_process_state(process_state)

    if plant_name in active_plants:
        active_plants.remove(plant_name)
    save_active_plants(active_plants)

    return {"status": "success", "message": f"Cliente para {plant_name} detenido correctamente."}

def restart_client(plant_name):
    """
    Reinicia un cliente para una planta específica.
    """
    stop_result = stop_client(plant_name)
    if stop_result["status"] == "error":
        return stop_result
    return start_client(plant_name)

def get_status():
    """
    Obtiene el estado de todos los clientes.
    """
    process_state = load_process_state()
    return {"status": "success", "data": {plant_name: os.path.exists(f"/proc/{pid}") for plant_name, pid in process_state.items()}}

def start_all_clients():
    """
    Inicia clientes para todas las plantas.
    """
    plants = fetch_plants()
    active_plants = load_active_plants()
    results = []

    for plant in plants:
        plant_name = plant["name"]
        if plant_name not in active_plants:
            result = start_client(plant_name)
            results.append(result)

    return {"status": "success", "data": results}

def stop_all_clients():
    """
    Detiene todos los clientes activos.
    """
    process_state = load_process_state()
    results = []

    for plant_name in list(process_state.keys()):
        result = stop_client(plant_name)
        results.append(result)

    return {"status": "success", "data": results}

def restart_all_clients():
    """
    Reinicia todos los clientes.
    """
    stop_results = stop_all_clients()
    start_results = start_all_clients()

    return {"status": "success", "data": {"stopped": stop_results, "started": start_results}}

def cleanup_orphan_processes():
    """
    Limpia los procesos huérfanos que ya no están activos.
    """
    process_state = load_process_state()
    active_plants = load_active_plants()
    updated_process_state = {}

    for plant_name, pid in process_state.items():
        if not os.path.exists(f"/proc/{pid}"):
            print(f"Proceso huérfano encontrado: {plant_name} con PID {pid}. Limpiando...")
            if plant_name in active_plants:
                active_plants.remove(plant_name)
        else:
            updated_process_state[plant_name] = pid

    save_process_state(updated_process_state)
    save_active_plants(active_plants)

if __name__ == "__main__":
    import sys

    # Ejecutar limpieza de procesos huérfanos al inicio
    cleanup_orphan_processes()

    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "Uso: main.py [start|stop|restart|status|start-all|stop-all|restart-all] [plant_name]"}))
        sys.exit(1)

    command = sys.argv[1]
    plant_name = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        if command == "start" and plant_name:
            result = start_client(plant_name)
        elif command == "stop" and plant_name:
            result = stop_client(plant_name)
        elif command == "restart" and plant_name:
            result = restart_client(plant_name)
        elif command == "status":
            result = get_status()
        elif command == "start-all":
            result = start_all_clients()
        elif command == "stop-all":
            result = stop_all_clients()
        elif command == "restart-all":
            result = restart_all_clients()
        else:
            result = {"status": "error", "message": "Comando desconocido o argumentos faltantes."}
    except Exception as e:
        result = {"status": "error", "message": f"Error ejecutando el comando: {e}"}

    print(json.dumps(result))