from plant_service import fetch_plants
from clients.iec104_client import start_iec104_client
from clients.modbus_client import start_modbus_client
import multiprocessing

def handle_plant(plant):
    """
    Maneja el procesamiento de una planta según su protocolo de comunicación.
    """
    protocolo = plant["protocoloComunicacion"]
    ip = plant["ip"]
    port = int(plant["puerto"])
    api_url = plant["apiUrl"]
    print(f"Protocolo: {protocolo}, IP: {ip}, Puerto: {port}, URL de la API: {api_url}")
    

    if protocolo == "IEC104":
        print(f"Iniciando cliente IEC104 para la planta: {plant['name']}")
        #start_iec104_client(ip, port, api_url)
    elif protocolo == "MODBUS":
        print(f"Iniciando cliente MODBUS para la planta: {plant['name']}")

        # Extraer valores de metadata
        
        metadata = plant.get("metadata", {})
        if metadata is not None:
            start_address = metadata.get("start_address", 0)  # Valor por defecto: 0
            max_registers = metadata.get("max_registers", 10)  # Valor por defecto: 10
            interval = metadata.get("interval", 5)  # Valor por defecto: 5
        else:
            start_address = 0
            max_registers = 10
            interval = 5

        start_modbus_client(ip, port, start_address, max_registers, interval, api_url)
    else:
        print(f"Protocolo desconocido para la planta: {plant['name']}")

if __name__ == "__main__":
    try:
        plants = fetch_plants()
        processes = []

        for plant in plants:
            # Crear un proceso independiente para cada planta
            p = multiprocessing.Process(target=handle_plant, args=(plant,))
            processes.append(p)
            p.start()

        for p in processes:
            p.join()

    except Exception as e:
        print(f"Error en el servidor principal: {e}")
