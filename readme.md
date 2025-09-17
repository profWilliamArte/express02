# Curso de Backend: Estructura Profesional de una API con Express

¡Bienvenido! En este proyecto, construiremos una API RESTful desde cero siguiendo las **mejores prácticas de la industria**. A diferencia de un enfoque simple donde todo el código reside en un solo archivo, aquí aplicaremos el principio de **Separación de Responsabilidades** para crear una aplicación modular, escalable y fácil de mantener [1-3].

Este es el estándar que encontrarás en entornos de trabajo profesionales.

### 🎯 Objetivo Principal

Aprender a organizar un proyecto de Express dividiendo la lógica en tres capas principales:

1.  **Rutas (`/routes`)**: Definen las URLs de nuestra API.
2.  **Controladores (`/controllers`)**: Contienen la lógica de negocio; qué hacer cuando se accede a una ruta.
3.  **Configuración (`/config`)**: Centraliza la conexión a la base de datos y otros servicios.

### 📂 Estructura del Proyecto Final

Este es el mapa de nuestra aplicación. 
Cada carpeta tiene un propósito específico [2, 3]:
```
/repuestos-backend
├── /config
│   └── db.js             # Configuración de la base de datos
├── /routes               # Rutas de la API
├── /controllers          # Lógica asociada a las rutas
├── /models               # Modelos de datos
├── app.js                # Archivo principal
├── .env                  # Variables de entorno
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🚀 Ruta de Aprendizaje: Construyendo la API Paso a Paso

### Paso 1: Preparación del Entorno y Dependencias

Comenzamos inicializando nuestro proyecto e instalando las herramientas necesarias [4-6].

1.  **Inicializa tu proyecto Node.js**:
    ```bash
    npm init -y
    ```

2.  **Instala las dependencias de producción**:
    *   `express`: El framework para construir nuestro servidor [4, 7].
    *   `mysql2`: El conector para nuestra base de datos MySQL [2, 4].
    *   `cors`: Middleware para permitir la comunicación entre frontend y backend [4, 5].
    *   `dotenv`: Para gestionar nuestras credenciales de forma segura [4, 6].
    ```bash
    npm install express mysql2 cors dotenv
    ```

3.  **Instala la dependencia de desarrollo**:
    *   `nodemon`: Reinicia el servidor automáticamente cuando guardamos cambios [4-6].
    ```bash
    npm install --save-dev nodemon
    ```

4.  **Configura los scripts en `package.json`**:
    Añade la sección `scripts` a tu `package.json` para ejecutar la aplicación fácilmente [8-10].
    ```json
    "scripts": {
      "start": "node app.js",
      "dev": "nodemon app.js"
    }
    ```

### Paso 2: Conexión Segura a la Base de Datos

Centralizamos la configuración de la base de datos en su propia carpeta para mantener el orden y la seguridad [9, 11, 12].

1.  **Crea la carpeta `config` y dentro el archivo `db.js`**:
    ```javascript
    // config/db.js
    const mysql = require('mysql2/promise');
    require('dotenv').config();

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
    });

    module.exports = pool;
    ```

2.  **Crea el archivo `.env` en la raíz del proyecto**:
    Aquí guardamos nuestras credenciales. **Este archivo nunca debe subirse a un repositorio público**.
    ```
    # .env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=dbjuegos
    ```

### Paso 3: La Lógica - Creando los Controladores

Los controladores son el "cerebro" de nuestra API. Contienen las funciones con la lógica que se ejecutará para cada ruta [3].

1.  **Crea la carpeta `/controllers`**.
2.  Dentro, crea el archivo `juegosController.js`. Aquí moveremos la lógica de las consultas SQL que antes estaban en `app.js` [13-15].

    ```javascript
    // controllers/juegosController.js
    const db = require('../config/db');

    const getJuegos = async (req, res) => {
      try {
        const [rows] = await db.query('SELECT * FROM juegos');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    const getGeneros = async (req, res) => {
      try {
        const [rows] = await db.query('SELECT * FROM generos');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    const getPlataformas = async (req, res) => {
      try {
        const [rows] = await db.query('SELECT * FROM plataformas');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    module.exports = { getJuegos, getGeneros, getPlataformas };
    ```

### Paso 4: Las Rutas - Creando el Enrutador

El enrutador define las URLs de nuestra API y las conecta con las funciones del controlador [16].

1.  **Crea la carpeta `/routes`**.
2.  Dentro, crea el archivo `juegos.js`.

    ```javascript
    // routes/juegos.js
    const express = require('express');
    const router = express.Router();
    const juegosController = require('../controllers/juegosController');

    // Mapeamos las rutas a las funciones del controlador
    router.get('/juegos', juegosController.getJuegos);
    router.get('/generos', juegosController.getGeneros);
    router.get('/plataformas', juegosController.getPlataformas);

    module.exports = router;
    ```

### Paso 5: El Orquestador - Configurando `app.js`

Ahora nuestro `app.js` es mucho más limpio. Su trabajo es configurar el servidor, los middlewares y conectar nuestras rutas [10, 17, 18].

1.  **Reemplaza el contenido de `app.js` con este código**:
    ```javascript
    const express = require('express');
    const cors = require('cors');
    const db = require('./config/db');
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Importar y usar las rutas definidas en /routes/juegos.js
    const rutasJuegos = require('./routes/juegos');
    app.use('/api', rutasJuegos);

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    // Opcional: Probar conexión a la DB al iniciar
    db.getConnection().then(conn => {
        console.log('Conexión a MySQL exitosa!');
        conn.release();
    }).catch(err => console.error('Error de conexión a MySQL:', err));
    ```
2.  **Inicia el servidor**:
    ```bash
    npm run dev
    ```

¡Listo! Ahora puedes probar tus endpoints en `http://localhost:3000/api/juegos`, `http://localhost:3000/api/generos`, etc.

---

## 🎓 Práctica para Casa: API para una Tienda (tienda2025)

¡Es tu turno de construir una API desde cero! El objetivo es aplicar la estructura profesional que aprendimos en clase (`/config`, `/routes`, `/controllers`) para crear un backend que gestione los datos de una tienda.

Toda la información que necesitas está en este mismo repositorio.

#### Paso 1: Configura la Base de Datos

1.  **Importa la Base de Datos**: Busca el archivo `tienda2025.sql` en este repositorio e impórtalo en tu gestor de MySQL (como phpMyAdmin, DBeaver, etc.). Esto creará la base de datos `tienda2025` con todas sus tablas y datos de ejemplo.
2.  **Actualiza tu Archivo `.env`**: Cambia el valor de `DB_NAME` para que apunte a la nueva base de datos. Debería quedar así:
    ```
    DB_NAME=tienda2025
    ```

#### Paso 2: Construye la API

Crea un nuevo proyecto desde cero siguiendo la estructura modular que vimos en clase. Tu misión es desarrollar los siguientes endpoints funcionales:

1.  **Endpoint de Clientes**:
    *   Crea un `clientesController.js` y un `clientes.js` en la carpeta de rutas.
    *   **`GET /api/clientes`**: Debe devolver una lista de todos los clientes de la base de datos.

2.  **Endpoint de Productos**:
    *   Crea un `productosController.js` y un `productos.js` en la carpeta de rutas.
    *   **`GET /api/productos`**: Debe devolver una lista de todos los productos.
    *   **`GET /api/categorias`**: Debe devolver la lista de todas las categorías de productos.

3.  **Endpoint de Pedidos**:
    *   Crea un `pedidosController.js` y un `pedidos.js` en la carpeta de rutas.
    *   **`GET /api/pedidos`**: Debe devolver una lista de todos los pedidos.

#### Desafío Adicional (Opcional)

Si te sientes con confianza, intenta crear un endpoint que reciba un parámetro en la URL:

*   **`GET /api/productos/:id`**: Debe devolver los detalles de **un solo producto** basado en el `id` que se le pasa en la URL.

¡Mucho éxito! Esta práctica es clave para afianzar tus habilidades como desarrollador backend.
