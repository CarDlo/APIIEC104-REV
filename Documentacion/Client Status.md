# Documentación del API `/client/`
Este Endpoint permite encende y apagar cada uno de los clientes de forma separada o todos los clientes. Ademas permite teenr infromacion del status actual del cliente, es decir sie sta apagado o encendido.

## **Plantas Disponibles**
Estas son las plantas disponibles para interactuar con la API:

- `Bayunca1`
- `Lavilla`
- `Oldt`
- `Solchacras`
- `Solsantonio`
- `Solhuaqui`
- `Sanpedro`
- `Gonzanenergy`
- `Produlesti`

## Endpoints

### 1. GET `/client/start/:plantName`
- **Descripción:** Inicia el cliente para una planta específica.
- **Parámetro:**
  - `plantName` (string): Nombre de la planta para la cual se desea iniciar el cliente.
- **Respuesta:**
  - `200 OK`: Cliente iniciado con éxito.
  - `400 Bad Request`: Nombre de la planta inválido o faltante.
  - `500 Internal Server Error`: Error al iniciar el cliente.

### 2. GET `/client/stop/:plantName`
- **Descripción:** Detiene el cliente para una planta específica.
- **Parámetro:**
  - `plantName` (string): Nombre de la planta para la cual se desea detener el cliente.
- **Respuesta:**
  - `200 OK`: Cliente detenido con éxito.
  - `400 Bad Request`: Nombre de la planta inválido o faltante.
  - `500 Internal Server Error`: Error al detener el cliente.

### 3. GET `/client/restart/:plantName`
- **Descripción:** Reinicia el cliente para una planta específica.
- **Parámetro:**
  - `plantName` (string): Nombre de la planta para la cual se desea reiniciar el cliente.
- **Respuesta:**
  - `200 OK`: Cliente reiniciado con éxito.
  - `400 Bad Request`: Nombre de la planta inválido o faltante.
  - `500 Internal Server Error`: Error al reiniciar el cliente.

### 4. GET `/client/status`
- **Descripción:** Obtiene el estado actual de todas las plantas en ejecución.
- **Respuesta:**
  - `200 OK`: Devuelve un objeto JSON con el estado de todas las plantas.
  - `500 Internal Server Error`: Error al obtener el estado.

### 5. GET `/client/start-all`
- **Descripción:** Inicia los clientes para todas las plantas.
- **Respuesta:**
  - `200 OK`: Todos los clientes iniciados con éxito.
  - `500 Internal Server Error`: Error al iniciar algunos o todos los clientes.

### 6. GET `/client/stop-all`
- **Descripción:** Detiene todos los clientes activos.
- **Respuesta:**
  - `200 OK`: Todos los clientes detenidos con éxito.
  - `500 Internal Server Error`: Error al detener algunos o todos los clientes.

### 7. GET `/client/restart-all`
- **Descripción:** Reinicia todos los clientes activos.
- **Respuesta:**
  - `200 OK`: Todos los clientes reiniciados con éxito.
  - `500 Internal Server Error`: Error al reiniciar algunos o todos los clientes.

## Ejemplos de Uso

### Iniciar una Planta Específica
```bash
GET /client/start/Bayunca1
```
Respuesta:
```json
{
  "status": "success",
  "message": "Cliente para Bayunca1 iniciado."
}
```

### Detener Todos los Clientes
```bash
GET /client/stop-all
```
Respuesta:
```json
{
  "status": "success",
  "message": "Todos los clientes detenidos con éxito."
}
```

### Obtener Estado
```bash
GET /client/status
```
Respuesta:
```json
{
  "status": "success",
  "data": {
    "Bayunca1": "ejecutando",,
    "SolChacras": "ejecutando"
  }
}
```
