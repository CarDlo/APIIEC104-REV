import requests
import logging

from dotenv import load_dotenv
import os
# Obtener la ruta completa del archivo .env (subir un nivel desde la carpeta Python)
ruta_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')

# Cargar las variables de entorno desde el archivo .env
load_dotenv(ruta_env)

# Obtener las variables de entorno
PLANT_HOST=os.getenv('PLANT_HOST')


# Configuración del archivo de registro
LOG_FILE = "main_errors.log"
logging.basicConfig(filename=LOG_FILE, level=logging.ERROR, format='%(asctime)s - %(message)s')

PLANT_ENDPOINT = PLANT_HOST  # Cambia la URL según tu configuración

def fetch_plants():
    """
    Obtiene la lista de plantas activas desde el endpoint /plant.
    """
    try:
        response = requests.get(PLANT_ENDPOINT)
        if response.status_code == 200:
            plants = response.json()
            if plants:
                # Filtrar solo las plantas activas
                active_plants = [plant for plant in plants if plant.get('active') == True]
                return active_plants
            else:
                raise Exception("No se encontraron datos de plantas en el endpoint.")
        else:
            raise Exception(f"Error al obtener la configuración: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error conectando al endpoint: {e}")
        raise
