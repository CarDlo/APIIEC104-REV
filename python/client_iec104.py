import functools
import time
import c104
import requests
import logging

# Configuración del archivo de registro
LOG_FILE = "api_errors.log"
logging.basicConfig(filename=LOG_FILE, level=logging.ERROR, format='%(asctime)s - %(message)s')

API_URL = "http://localhost:3000/registros"

# URL de la API de Express
def send_data_to_api(io_address, value, type):
    data = {
        "direccion": io_address,
        "value": value,
        "equipo_iec_870_5_104": type
    }
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            print("Data sent to API:", response.json())
        else:
            logging.error(f"Failed to send data to API. Status code: {response.status_code}, Response: {response.text}, Data: {data}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error connecting to API: {e}, Data: {data}")

my_client = c104.Client(tick_rate_ms=5000, command_timeout_ms=5000)
my_client.originator_address = 123
cl_connection_1 = my_client.add_connection(ip="127.0.0.1", port=2404, init=c104.Init.ALL)

##################################
# NEW DATA HANDLER
##################################

def cl_pt_on_receive_point(point: c104.Point, previous_info: c104.Information, message: c104.IncomingMessage) -> c104.ResponseState:
    return c104.ResponseState.SUCCESS


##################################
# NEW OBJECT HANDLER
##################################

def cl_on_new_station(client: c104.Client, connection: c104.Connection, common_address: int, custom_arg: str, y: str = "default value") -> None:
    connection.add_station(common_address=common_address)


def cl_on_new_point(client: c104.Client, station: c104.Station, io_address: int, point_type: c104.Type) -> None:
    point = station.add_point(io_address=io_address, type=point_type)
    point.on_receive(callable=cl_pt_on_receive_point)


my_client.on_new_station(callable=functools.partial(cl_on_new_station, custom_arg="extra argument with default/bounded value passes signature check"))
my_client.on_new_point(callable=cl_on_new_point)


##################################
# RAW MESSAGE HANDLER
##################################

def log_data(connection: c104.Connection, data: bytes) -> None:
    # Aquí puedes procesar la información de alguna manera, por ejemplo, guardarla en un archivo de registro
    with open("registro.log", "a") as f:
        f.write("CL] -out-> {1} [{0}] | CONN OA {2}\n".format(data.hex(), c104.explain_bytes_dict(apdu=data), connection.originator_address))

def cl_ct_on_receive_raw(connection: c104.Connection, data: bytes) -> None:
    pass

def cl_ct_on_send_raw(connection: c104.Connection, data: bytes) -> None:
    pass

cl_connection_1.on_receive_raw(callable=cl_ct_on_receive_raw)
cl_connection_1.on_send_raw(callable=cl_ct_on_send_raw)

##################################
# Dump points
##################################

def cl_dump():
    global my_client, cl_connection_1
    if cl_connection_1.is_connected:
        cl_ct_count = len(my_client.connections)
        for ct_iter in range(cl_ct_count):
            ct = my_client.connections[ct_iter]
            ct_st_count = len(ct.stations)
            for st_iter in range(ct_st_count):
                st = ct.stations[st_iter]
                st_pt_count = len(st.points)
                for pt_iter in range(st_pt_count):
                    pt = st.points[pt_iter]
                    print("Tipo: {0} | IOA: {1} | Valor: {2} | Station: {3}".format(pt.type, pt.io_address, pt.value, st.common_address))
                    send_data_to_api(pt.io_address, pt.value, st.common_address)
##################################
# connect loop
##################################

my_client.start()

while not cl_connection_1.is_connected:
    print("CL] Waiting for connection to {0}:{1}".format(cl_connection_1.ip, cl_connection_1.port))
    time.sleep(1)

##################################
# Loop through points
##################################

while cl_connection_1.is_connected:
    cl_dump()
    time.sleep(3)

##################################
# done
##################################

my_client.stop()