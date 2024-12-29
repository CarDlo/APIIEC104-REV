import functools
import time
import c104
import requests
import logging

# Configuración del archivo de registro
LOG_FILE = "iec104_client.log"
logging.basicConfig(filename=LOG_FILE, level=logging.ERROR, format='%(asctime)s - %(message)s')


def start_iec104_client(ip, port, api_url, tick_rate_ms, command_timeout_ms, time_sender_sleep_s, originator_address, time_connect_s):

    print("Iniciando cliente IEC104...")
    """
    Inicia un cliente IEC104 con los parámetros específicos de una planta.
    
    Args:
        ip (str): Dirección IP de la planta.
        port (int): Puerto de la planta.
        api_url (str): URL de la API para registrar los datos.
    """
    # URL de la API de Express
    def send_data_to_api(io_address, value, type):
        data = {
            "direccion": io_address,
            "value": value,
            "REG_CA": type
        }
        try:
            response = requests.post(api_url, json=data)
            if response.status_code == 200:
                print(f"Data sent to API: {response.json()}")
            else:
                logging.error(f"Failed to send data to API. Status code: {response.status_code}, Response: {response.text}, Data: {data}")
        except requests.exceptions.RequestException as e:
            logging.error(f"Error connecting to API: {e}, Data: {data}")

    # Configuración del cliente IEC 104
    my_client = c104.Client(tick_rate_ms=tick_rate_ms, command_timeout_ms=command_timeout_ms)
    my_client.originator_address = originator_address

    try:
        cl_connection_1 = my_client.add_connection(ip=ip, port=port, init=c104.Init.ALL)
    except Exception as e:
        logging.error(f"Error al agregar la conexión IEC104: {e}")
        return

    ##################################
    # Handlers
    ##################################

    def cl_pt_on_receive_point(point: c104.Point, previous_info: c104.Information, message: c104.IncomingMessage) -> c104.ResponseState:
        """
        Callback que se ejecuta al recibir datos de un punto.
        """
        print(f"Point received - IOA: {point.io_address}, Value: {point.value}")
        return c104.ResponseState.SUCCESS

    def cl_on_new_station(client: c104.Client, connection: c104.Connection, common_address: int) -> None:
        """
        Callback que se ejecuta al detectar una nueva estación.
        """
        print(f"New station detected - Common Address: {common_address}")
        connection.add_station(common_address=common_address)

    def cl_on_new_point(client: c104.Client, station: c104.Station, io_address: int, point_type: c104.Type) -> None:
        """
        Callback que se ejecuta al detectar un nuevo punto.
        """
        print(f"New point detected - IOA: {io_address}, Type: {point_type}")
        point = station.add_point(io_address=io_address, type=point_type)
        point.on_receive(callable=cl_pt_on_receive_point)

    # Registrar los callbacks
    my_client.on_new_station(callable=cl_on_new_station)
    my_client.on_new_point(callable=cl_on_new_point)

    ##################################
    # Dump points
    ##################################

    def cl_dump():
        """
        Itera sobre las conexiones, estaciones y puntos para procesar los datos.
        """
        if cl_connection_1.is_connected:
            for connection in my_client.connections:
                for station in connection.stations:
                    for point in station.points:
                        print(f"Tipo: {point.type} | IOA: {point.io_address} | Valor: {point.value} | Station: {station.common_address}")
                        send_data_to_api(point.io_address, point.value, station.common_address)

    ##################################
    # Main Loop
    ##################################

    my_client.start()

    try:
        while not cl_connection_1.is_connected:
            print(f"IEC104] Waiting for connection to {ip}:{port}")
            time.sleep(time_connect_s) # Esperar time_connect_s segundo

        print(f"IEC104 client connected to {ip}:{port}")

        while cl_connection_1.is_connected:
            cl_dump()
            time.sleep(time_sender_sleep_s) # Esperar time_sender_sleep_s segundos para la siguiente lectura

    except KeyboardInterrupt:
        print("Stopping IEC104 client.")
    except Exception as e:
        logging.error(f"Error in IEC104 client main loop: {e}")
    finally:
        my_client.stop()
        print("IEC104 client stopped.")
