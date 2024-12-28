# Documentación del API `/api/:planta`

Este Endpoint permite acceder a cada una de las tablas de la base de datos que se tienen destinadas para cada una de las plantas.

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

## **Endpoints**

### **1. Crear un Registro**
**Endpoint:** `POST /api/:planta`

Crea un nuevo registro en la tabla de la planta especificada.

#### **Parámetros de la Ruta:**
- `:planta`: Nombre de la planta (debe ser una de las plantas disponibles).

#### **Cuerpo de la Solicitud:**
```json
{
    "REG_CA": 123,
    "value": 45.6,
    "direccion": 789,
    "metadata": {
        "sensor": "temperature",
        "unit": "Celsius"
    }
}
```

#### **Respuesta Exitosa:**
- **Código HTTP:** `201 Created`
- **Cuerpo:**
```json
{
    "message": "Registro creado exitosamente en la planta Bayunca1",
    "data": {
        "id": 1,
        "REG_CA": 123,
        "value": 45.6,
        "direccion": 789,
        "metadata": {
            "sensor": "temperature",
            "unit": "Celsius"
        },
        "createdAt": "2024-12-22 06:37:33.802",
        "updatedAt": "2024-12-22 06:37:33.802"
    }
}
```

#### **Ejemplo de Respuesta de Error:**
- **Código HTTP:** `400 Bad Request`
- **Cuerpo:**
```json
{
    "message": "Faltan campos obligatorios: REG_CA, value, direccion."
}
```

### **2. Obtener Todos los Registros**
**Endpoint:** `GET /api/:planta`

Obtiene todos los registros de la tabla de la planta especificada.

#### **Parámetros de la Ruta:**
- `:planta`: Nombre de la planta (debe ser una de las plantas disponibles).

#### **Respuesta Exitosa:**
- **Código HTTP:** `200 OK`
- **Cuerpo:**
```json
[
    {
        "id": 1,
        "REG_CA": 123,
        "value": 45.6,
        "direccion": 789,
        "metadata": {
            "sensor": "temperature",
            "unit": "Celsius"
        },
        "createdAt": "2024-12-22 06:37:33.802",
        "updatedAt": "2024-12-22 06:37:33.802"
    },
    {
        "id": 2,
        "REG_CA": 456,
        "value": 78.9,
        "direccion": 123,
        "metadata": {
            "sensor": "humidity",
            "unit": "%"
        },
        "createdAt": "2024-12-22 07:00:00.000",
        "updatedAt": "2024-12-22 07:00:00.000"
    }
]
```

#### **Ejemplo de Respuesta de Error:**
- **Código HTTP:** `404 Not Found`
- **Cuerpo:**
```json
{
    "message": "La planta Bayunca2 no existe en el sistema."
}
```

### **3. Obtener un Registro por ID**
**Endpoint:** `GET /api/:planta/:id`

Obtiene un registro específico por su ID de la tabla de la planta especificada.

#### **Parámetros de la Ruta:**
- `:planta`: Nombre de la planta (debe ser una de las plantas disponibles).
- `:id`: ID del registro.

#### **Respuesta Exitosa:**
- **Código HTTP:** `200 OK`
- **Cuerpo:**
```json
{
    "id": 1,
    "REG_CA": 123,
    "value": 45.6,
    "direccion": 789,
    "metadata": {
        "sensor": "temperature",
        "unit": "Celsius"
    },
    "createdAt": "2024-12-22 06:37:33.802",
    "updatedAt": "2024-12-22 06:37:33.802"
}
```

#### **Respuesta de Error (Registro No Encontrado):**
- **Código HTTP:** `404 Not Found`
- **Cuerpo:**
```json
{
    "message": "Registro no encontrado"
}
```

### **4. Filtrar Registros**
**Endpoint:** `GET /api/:planta/filter`

Filtra los registros de la tabla de la planta especificada con base en los parámetros proporcionados.

#### **Parámetros de la Ruta:**
- `:planta`: Nombre de la planta (debe ser una de las plantas disponibles).

#### **Query Parameters:**
- `startDate`(opcional): Fecha de inicio en formato `YYYY-MM-DD HH:mm:ss.sss`.
- `endDate`(opcional): Fecha de fin en formato `YYYY-MM-DD HH:mm:ss.sss`.
- `column` : Nombre de la columna a filtrar (`REG_CA`, `value`, `direccion`, `metadata`).
- `search`: Valor a buscar en la columna especificada.

#### **Ejemplo de Solicitud (con rango de fechas):**
```http
GET /api/Bayunca1/filter?startDate=2024-12-21 00:00:00.000&endDate=2024-12-22 23:59:59.999&column=value&search=45.6
```

#### **Ejemplo de Solicitud (sin rango de fechas):**
```http
GET /api/Bayunca1/filter?column=direccion&search=789
```

#### **Respuesta Exitosa:**
- **Código HTTP:** `200 OK`
- **Cuerpo:**
```json
[
    {
        "id": 1,
        "REG_CA": 123,
        "value": 45.6,
        "direccion": 789,
        "metadata": {
            "sensor": "temperature",
            "unit": "Celsius"
        },
        "createdAt": "2024-12-22 06:37:33.802",
        "updatedAt": "2024-12-22 06:37:33.802"
    }
]
```

#### **Errores Comunes:**
- **Código HTTP:** `400 Bad Request`
- **Cuerpo:**
```json
{
    "message": "El parámetro 'column' y 'search' son obligatorios."
}
```

- **Código HTTP:** `404 Not Found`
- **Cuerpo:**
```json
{
    "message": "No se encontraron registros con el valor especificado."
}
```

---

## **Explicación de las columnas de la tabla**

A continuación, se detalla el propósito de cada columna utilizada en las tablas de las plantas:

- **id**: Identificador único de cada registro. Es generado automáticamente y se utiliza para referenciar registros específicos.
- **REG_CA**: Start Addres para Modbus o Common Addres para IEC104.
- **value**: Valor medido o registrado, como una lectura de sensor o métrica relevante para la planta.
- **direccion**: Dirección asociada a la medición o registro, como un identificador del punto de origen de los datos puede ser null, para IEC104 es el IO Addres.
- **metadata**: Información adicional en formato JSON que describe el contexto de la medición, como el tipo de sensor, la unidad de medida, etc.
- **createdAt**: Fecha y hora en que se creó el registro. Útil para el seguimiento y auditoría de datos.
- **updatedAt**: Fecha y hora de la última actualización del registro. Indica cuándo fue modificado por última vez.

---

