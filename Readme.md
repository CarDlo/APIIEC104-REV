# Documentación del Endpoint `filterRegistros`

Este endpoint permite filtrar registros almacenados en la base de datos según criterios personalizados. El cliente puede buscar en una columna específica y aplicar un rango de fechas.

## URL del Endpoint
```
GET /registros/filter
```

## Parámetros de Consulta

### 1. **`search`** (opcional)
- **Descripción:** Valor a buscar en la columna seleccionada.
- **Tipo:** `string` o `number`.
- **Ejemplo:** `search=104`.

### 2. **`column`** (opcional)
- **Descripción:** Columna donde realizar la búsqueda.
- **Tipo:** `string`.
- **Valores Permitidos:**
  - `id`
  - `equipo_iec_870_5_104`
  - `value`
  - `direccion`
- **Ejemplo:** `column=equipo_iec_870_5_104`.

### 3. **`startDate`** (opcional)
- **Descripción:** Fecha de inicio para filtrar registros.
- **Tipo:** `string` (formato `ISO 8601`).
- **Ejemplo:** `startDate=2024-12-01T00:00:00.000Z`.

### 4. **`endDate`** (opcional)
- **Descripción:** Fecha de fin para filtrar registros.
- **Tipo:** `string` (formato `ISO 8601`).
- **Ejemplo:** `endDate=2024-12-10T23:59:59.999Z`.

## Respuestas del Servidor

### 1. **200 OK**
- **Descripción:** Devuelve los registros que cumplen con los criterios especificados.
- **Formato de Respuesta:**
```json
[
  {
    "id": 1,
    "equipo_iec_870_5_104": 104,
    "value": 150.5,
    "direccion": 10,
    "createdAt": "2024-12-10T02:15:05.867Z",
    "updatedAt": "2024-12-10T05:20:10.123Z"
  },
  {
    "id": 2,
    "equipo_iec_870_5_104": 105,
    "value": 200.0,
    "direccion": 20,
    "createdAt": "2024-12-09T18:25:30.456Z",
    "updatedAt": "2024-12-10T01:10:00.789Z"
  }
]
```

### 2. **400 Bad Request**
- **Descripción:** Cuando se proporciona un valor no válido para los parámetros.
- **Formato de Respuesta:**
```json
{
  "message": "La columna nombre no está permitida."
}
```

### 3. **500 Internal Server Error**
- **Descripción:** Error interno del servidor.
- **Formato de Respuesta:**
```json
{
  "message": "Error fetching registros",
  "error": "Detalles del error interno"
}
```

## Ejemplos de Uso

### 1. Buscar en una columna específica sin rango de fechas
```
GET /registros/filter?search=104&column=equipo_iec_870_5_104
```
**Respuesta:**
```json
[
  {
    "id": 1,
    "equipo_iec_870_5_104": 104,
    "value": 150.5,
    "direccion": 10,
    "createdAt": "2024-12-10T02:15:05.867Z",
    "updatedAt": "2024-12-10T05:20:10.123Z"
  }
]
```

### 2. Buscar en una columna específica con rango de fechas
```
GET /registros/filter?search=150&column=value&startDate=2024-12-01T00:00:00.000Z&endDate=2024-12-10T23:59:59.999Z
```
**Respuesta:**
```json
[
  {
    "id": 3,
    "equipo_iec_870_5_104": 105,
    "value": 150.0,
    "direccion": 15,
    "createdAt": "2024-12-05T14:10:15.123Z",
    "updatedAt": "2024-12-07T10:20:25.456Z"
  }
]
```

### 3. Error al usar una columna no permitida
```
GET /registros/filter?search=123&column=nombre
```
**Respuesta:**
```json
{
  "message": "La columna nombre no está permitida."
}
