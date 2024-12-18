# **Guía para Correr el Proyecto**

## **1. Descargar el proyecto desde GitHub**

Para descargar el proyecto, ejecute el siguiente comando en su terminal:

```bash
# Clona el repositorio desde GitHub
git clone [URL_DEL_REPOSITORIO]
```

> **Nota:** Reemplace `[URL_DEL_REPOSITORIO]` con la URL real del repositorio.

Una vez clonado, acceda a la carpeta del proyecto:

```bash
cd [NOMBRE_DEL_PROYECTO]
```

> **Nota:** Reemplace `[NOMBRE_DEL_PROYECTO]` con el nombre de la carpeta del proyecto clonado.

---

## **2. Crear y activar el entorno virtual**

Ubíquese en la carpeta **/python** del proyecto:

```bash
cd python
```

Cree un entorno virtual ejecutando el siguiente comando:

```bash
python -m venv venv
```

> **Nota:** Este comando crea un entorno virtual llamado `venv`.

Para activar el entorno virtual, ejecute:

**En Windows:**
```bash
venv\Scripts\activate
```

**En macOS y Linux:**
```bash
source venv/bin/activate
```

Si la activación fue exitosa, debería ver algo como `(venv)` al inicio de la línea de la terminal.

---

## **3. Instalar los paquetes de Python**

Con el entorno virtual activado, instale las dependencias que se encuentran en el archivo **requirements.txt**:

```bash
pip install -r requirements.txt
```

Este comando instalará todas las dependencias necesarias para que el proyecto Python funcione correctamente.

---

## **4. Instalar los paquetes de Node.js**

Ubíquese en la carpeta **raíz del proyecto** (la carpeta principal):

```bash
cd ..
```

Instale las dependencias de Node.js utilizando el siguiente comando:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias para la parte de Node.js del proyecto.

---

## **5. Configurar el archivo `.env`**

Cree o edite el archivo **.env** en la carpeta principal del proyecto. Este archivo debe contener la configuración de la base de datos y otras variables de entorno necesarias.

Ejemplo de archivo **.env**:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_base_de_datos
```

> **Nota:** Reemplace los valores con la información real de su base de datos.

---

## **6. Ejecutar el proyecto**

Con todo configurado, puede iniciar el proyecto con el siguiente comando:

```bash
npm run dev
```

Este comando iniciará el servidor de desarrollo y el proyecto estará disponible para su uso.

---

## **7. Activar el servidor de Python**

Existen dos formas de activar el servidor de Python:

1. **Enviar una solicitud POST al endpoint `/start-python-script`**:
   - Utilice una herramienta como **Postman** o **Thunder Client** para realizar la solicitud POST al endpoint:
     ```
     POST http://localhost:[PUERTO]/start-python-script
     ```
     > **Nota:** Reemplace `[PUERTO]` con el puerto que esté utilizando el servidor.

2. **Ejecutar el script manualmente**:
   - Ubíquese en la raíz del proyecto:
     ```bash
     cd [NOMBRE_DEL_PROYECTO]
     ```
   - Luego acceda a la carpeta **/python**:
     ```bash
     cd python
     ```
   - Ejecute el siguiente comando para activar el servidor de Python:
     ```bash
     python client_iec104.py
     ```

Con esta guía, su proyecto estará listo para ejecutarse.

# Endpoint `filterRegistros`

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
