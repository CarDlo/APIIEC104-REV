import c104
import time
from datetime import datetime
import requests

# URL de la API de Express
API_URL = "http://localhost:3000/registros"

def send_data_to_api(io_address, value, type):
    data = {
        "direccion": io_address,
        "value": value,
        "equipo_iec_870_5_104": 1
    }
    response = requests.post(API_URL, json=data)
    print("Data sent to API:", response.json())

def main():
    # client, connection and station preparation
    client = c104.Client()
    connection = client.add_connection(ip="127.0.0.1", port=2404, init=c104.Init.ALL)
    station = connection.add_station(common_address=1)

    # Monitoring point preparation for the first signal (address 32000)
    point1 = station.add_point(io_address=32000, type=c104.Type.M_ME_NC_1)

    # Start client
    client.start()

    # Wait for the connection to be established
    while connection.state != c104.ConnectionState.OPEN:
        print("Esperando conexión a {0}:{1}".format(connection.ip, connection.port))
        time.sleep(1)

    print(f"Conectado a {connection.ip}:{connection.port}")

    # Check if points were successfully added
    if point1 is None:
        print("No se pudieron agregar los puntos de monitoreo.")
        return

    # Infinite loop to continuously read and display values
    try:
        while True:
            # Read the first signal (address 32000)
            point1.read()
            value1 = point1.value if point1.value is not None else "N/A"

            # Send data to API
            send_data_to_api(point1.io_address, value1, point1.type)

            # Delay before the next iteration
            time.sleep(1)  # Ajusta el tiempo según lo necesario

    except KeyboardInterrupt:
        print("\nDetenido manualmente. Saliendo...")

    # Stop client when manually interrupted
    client.stop()

if __name__ == "__main__":
    main()