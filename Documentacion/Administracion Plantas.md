# Documentación del API `/plants`

La API permite gestionar información relacionada con plantas fotovoltaicas. A continuación, se describen los endpoints disponibles y cómo utilizarlos.

## Base URL
```
/plants
```

---

## **Endpoints**

### **1. Obtener todas las plantas**
**GET `/plants`**

Este endpoint devuelve una lista con todas las plantas registradas.

#### **Ejemplo de solicitud**
```http
GET /plants HTTP/1.1
Host: localhost:3000
```

#### **Modelo de respuesta**
```json
[
  {
    "id": 1,
    "name": "Bayunca 1",
    "province": "Bayunca",
    "country": "Colombia",
    "potenciaDC": 3.58,
    "scada": "Webdom",
    "protocoloComunicacion": "MODBUS",
    "ip": "localhost",
    "puerto": 502,
    "apiUrl": "http://localhost/api/bayunca1",
    "credenciales": null,
    "metadata": null
  },
  {
    "id": 2,
    "name": "La Villa",
    "province": "Lo Santos",
    "country": "Panamá",
    "potenciaDC": 13.52,
    "scada": "BLC",
    "protocoloComunicacion": "IEC104",
    "ip": "localhost",
    "puerto": 2404,
    "apiUrl": "http://localhost/api/lavilla",
    "credenciales": null,
    "metadata": null
  }
]
```

---

### **2. Obtener una planta por ID**
**GET `/plants/:id`**

Este endpoint devuelve la información de una planta específica según su ID.

#### **Ejemplo de solicitud**
```http
GET /plants/1 HTTP/1.1
Host: localhost:3000
```

#### **Modelo de respuesta**
```json
{
  "id": 1,
  "name": "Bayunca 1",
  "province": "Bayunca",
  "country": "Colombia",
  "potenciaDC": 3.58,
  "scada": "Webdom",
  "protocoloComunicacion": "MODBUS",
  "ip": "localhost",
  "puerto": 502,
  "apiUrl": "http://localhost/api/bayunca1",
  "credenciales": null,
  "metadata": null
}
```

#### **Errores comunes**
- **404 Not Found**: Si el ID no corresponde a ninguna planta.

---

### **3. Crear una nueva planta**
**POST `/plants`**

Este endpoint permite crear una nueva planta.

#### **Ejemplo de solicitud**
```http
POST /plants HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Nueva Planta",
  "province": "Nueva Provincia",
  "country": "Colombia",
  "potenciaDC": 5.00,
  "scada": "Nuevo SCADA",
  "protocoloComunicacion": "MODBUS",
  "ip": "localhost",
  "puerto": 502,
  "apiUrl": "http://localhost/api/nueva_planta",
  "credenciales": {},
  "metadata":  {
    "start_address": 0,
    "max_registers": 10,
    "interval": 5
  }
}
```
#### **Modbus configuracíon**
En el campo `metadata` se debe agregar los valores de `start_address, max_registers, interval` en formato json, estos valores seran consultados por el cliente de modbus para configuracíon, si estos campos no se agregan se tomara por defecto `start_address: 0, max_registers: 10, interval: 5`.
 
  - **start_address**: dirección inicial de lectura en el dispositivo modbus.
  - **max_registers**: cantidad máxima de registros a leer desde la dirección inicial.
  - **interval**: intervalo en segundos entre lecturas consecutivas.


#### **Nota importante**
- El campo `protocoloComunicacion` solo acepta los valores:
  - `MODBUS`
  - `IEC104`

#### **Modelo de respuesta**
```json
{
  "id": 3,
  "name": "Nueva Planta",
  "province": "Nueva Provincia",
  "country": "Colombia",
  "potenciaDC": 5.00,
  "scada": "Nuevo SCADA",
  "protocoloComunicacion": "MODBUS",
  "ip": "localhost",
  "puerto": 502,
  "apiUrl": "http://localhost/api/nueva_planta",
  "credenciales": {},
  "metadata": {}
}
```

#### **Errores comunes**
- **400 Bad Request**: Si faltan campos requeridos, los datos son inválidos o el valor de `protocoloComunicacion` no es válido.

---

### **4. Actualizar una planta existente**
**PUT `/plants/:id`**

Este endpoint permite actualizar la información de una planta existente.

#### **Ejemplo de solicitud**
```http
PUT /plants/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Planta Actualizada",
  "province": "Provincia Actualizada",
  "country": "Colombia",
  "potenciaDC": 4.00,
  "scada": "SCADA Actualizado",
  "protocoloComunicacion": "IEC104",
  "ip": "localhost",
  "puerto": 2404,
  "apiUrl": "http://localhost/api/planta_actualizada",
  "credenciales": {},
  "metadata": {}
}
```

#### **Nota importante**
- El campo `protocoloComunicacion` solo acepta los valores:
  - `MODBUS`
  - `IEC104`

#### **Modelo de respuesta**
```json
{
  "id": 1,
  "name": "Planta Actualizada",
  "province": "Provincia Actualizada",
  "country": "Colombia",
  "potenciaDC": 4.00,
  "scada": "SCADA Actualizado",
  "protocoloComunicacion": "IEC104",
  "ip": "localhost",
  "puerto": 2404,
  "apiUrl": "http://localhost/api/planta_actualizada",
  "credenciales": {},
  "metadata": {}
}
```

#### **Errores comunes**
- **404 Not Found**: Si el ID no corresponde a ninguna planta.
- **400 Bad Request**: Si los datos enviados son inválidos o el valor de `protocoloComunicacion` no es válido.

---

### **5. Eliminar una planta**
**DELETE `/plants/:id`**

Este endpoint elimina una planta específica según su ID.

#### **Ejemplo de solicitud**
```http
DELETE /plants/1 HTTP/1.1
Host: localhost:3000
```

#### **Modelo de respuesta**
```json
{
  "message": "Planta eliminada exitosamente."
}
```

#### **Errores comunes**
- **404 Not Found**: Si el ID no corresponde a ninguna planta.

---

## **Explicación de las columnas de la tabla**

A continuación, se detalla el propósito de cada columna en la tabla `plants`:

- **id**: Identificador único de cada planta. Se utiliza para referenciar la planta en operaciones como consultas, actualizaciones o eliminaciones.
- **name**: Nombre de la planta fotovoltaica. Permite identificarla de manera descriptiva.
- **province**: Provincia o región donde está ubicada la planta. Proporciona información geográfica detallada.
- **country**: País donde se encuentra la planta. Facilita clasificar las plantas por ubicación nacional.
- **potenciaDC**: Potencia en corriente directa (DC) de la planta en megavatios (MW). Representa la capacidad energética instalada.
- **scada**: Sistema de supervisión y adquisición de datos (SCADA) utilizado en la planta. Permite gestionar y monitorizar las operaciones.
- **protocoloComunicacion**: Protocolo de comunicación usado por la planta (ejemplo: `MODBUS` o `IEC104`). Define cómo se transmiten los datos entre dispositivos.
- **ip**: Dirección IP del sistema de control o SCADA de la planta. Es necesario para la comunicación con la planta.
- **puerto**: Puerto de comunicación asociado al protocolo usado por la planta. Define el punto de acceso para las conexiones.
- **apiUrl**: URL del API asociado a la planta. Permite acceder a datos específicos o gestionar la planta de manera remota.
- **credenciales**: Información de autenticación requerida para acceder al SCADA o API de la planta (si aplica). Generalmente contiene un objeto con claves como `username` y `password`.
- **metadata**: Información adicional o personalizada relacionada con la planta, en formato JSON. Se utiliza para almacenar detalles específicos que no están cubiertos por otras columnas. Para el caso de modbus se requiere informacion de valores start_address: Dirección inicial de lectura, max_registers: Cantidad máxima de registros a leer e interval: Intervalo en segundos entre lecturas. Para modbus El programa usará los valores por defecto: start_address = 0, max_registers = 10, interval = 5.
- **active**: Columna de tipo boolean para identificar si la planta se encuentra activa(true) o inactiva(false), si el valor es (true) el cliente ejecutara la captura de datos.

---
