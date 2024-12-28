import c104
import random
import time
import json

def load_signals_from_json(json_file):
    """Carga la configuración de señales desde un archivo JSON."""
    with open(json_file, 'r') as file:
        return json.load(file)

def before_auto_transmit(point: c104.Point) -> None:
    """Actualiza el valor del punto antes de la transmisión automática."""
    point.value = random.uniform(0, 100)
    common_address = point.station.common_address
    if point.io_address == 32000 and common_address == 1025:
        print("{0} BEFORE AUTOMATIC REPORT on CA: {1} IOA: {2} VALUE: {3}".format(point.type, common_address, point.io_address, point.value))

def before_read(point: c104.Point) -> None:
    """Actualiza el valor del punto antes de una lectura."""
    point.value = random.uniform(0, 100)
    common_address = point.station.common_address
    if point.io_address == 32000 and common_address == 1025:
        print("{0} BEFORE READ or INTERROGATION on CA: {1} IOA: {2} VALUE: {3}".format(point.type, common_address, point.io_address, point.value))

def parse_signal_type(type_str):
    """Convierte el tipo de objeto del JSON al tipo correspondiente en c104."""
    try:
        return getattr(c104.Type, type_str)
    except AttributeError:
        print(f"Tipo de objeto desconocido: {type_str}. Usando M_ME_NC_1 por defecto.")
        return c104.Type.M_ME_NC_1

def main():
    # Carga las señales desde el archivo JSON
    signals = load_signals_from_json('./config.json')

    # Configuración del servidor
    server = c104.Server(tick_rate_ms=1000, select_timeout_ms=1000)
    
    # Agregar estaciones y puntos según el archivo JSON
    stations = {}
    for signal in signals:
        common_address = signal['iec_870_5_104']
        io_address = signal['direccion']
        point_type_str = signal['tipo_objeto']
        point_type = parse_signal_type(point_type_str)

        # Crear estación si no existe
        if common_address not in stations:
            stations[common_address] = server.add_station(common_address=common_address)
            
        station = stations[common_address]

        # Crear y configurar el punto
        point = station.add_point(io_address=io_address, type=point_type, report_ms=1000)
        point.on_before_auto_transmit(callable=before_auto_transmit)
        point.on_before_read(callable=before_read)

    # Iniciar el servidor
    server.start()
    print("Servidor iniciado. Esperando conexiones...")

    while not server.has_active_connections:
        print("Esperando conexión...")
        time.sleep(1)

    print("Cliente conectado. Enviando datos...")
    while server.has_open_connections:
        time.sleep(1)

    print("Conexión cerrada. Deteniendo servidor...")
    server.stop()

if __name__ == "__main__":
    main()
