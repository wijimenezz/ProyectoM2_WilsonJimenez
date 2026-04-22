# API Blog

REST API para gestión de un blog con autores, posts y comentarios. Permite crear, leer, actualizar y eliminar recursos relacionados entre sí mediante una base de datos PostgreSQL.

---

## URL DE REPOSITORIO EN GITHUB

https://github.com/wijimenezz/ProyectoM2_WilsonJimenez

---

## URL de la API

```
https://proyectom2wilsonjimenez-production.up.railway.app/api
```

Documentación interactiva (Swagger UI):

```
https://proyectom2wilsonjimenez-production.up.railway.app/api-docs
```

---

## Tecnologías utilizadas

- **Node.js** — entorno de ejecución
- **Express** — framework para el servidor HTTP
- **PostgreSQL** — base de datos relacional
- **node-postgres (pg)** — cliente de PostgreSQL para Node.js
- **Railway** — plataforma de deploy
- **Swagger UI** — documentación interactiva
- **Vitest** — testing unitario e integración
- **Supertest** — testing de endpoints HTTP

---

## Endpoints disponibles

### Authors

| Método | Endpoint           | Descripción               |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/authors`     | Obtener todos los autores |
| GET    | `/api/authors/:id` | Obtener un autor por id   |
| POST   | `/api/authors`     | Crear un autor            |
| PUT    | `/api/authors/:id` | Actualizar un autor       |
| DELETE | `/api/authors/:id` | Eliminar un autor         |

### Posts

| Método | Endpoint                 | Descripción             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/posts`             | Obtener todos los posts |
| GET    | `/api/posts/:id`         | Obtener un post por id  |
| GET    | `/api/posts/authors/:id` | Obtener posts por autor |
| POST   | `/api/posts`             | Crear un post           |
| PUT    | `/api/posts/:id`         | Actualizar un post      |
| DELETE | `/api/posts/:id`         | Eliminar un post        |
| PATCH  | `/api/posts/publish/:id` | Publicar un post        |

### Comments

| Método | Endpoint                    | Descripción                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/comments`             | Obtener todos los comentarios |
| GET    | `/api/comments/:id`         | Obtener un comentario por id  |
| GET    | `/api/comments/authors/:id` | Obtener comentarios por autor |
| GET    | `/api/comments/posts/:id`   | Obtener comentarios por post  |
| POST   | `/api/comments`             | Crear un comentario           |
| PUT    | `/api/comments/:id`         | Actualizar un comentario      |
| DELETE | `/api/comments/:id`         | Eliminar un comentario        |

---

## Ejemplos de uso

### Authors

```bash
# Obtener todos los autores
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/authors

# Obtener un autor por id
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/authors/1

# Crear un autor
curl -X POST https://proyectom2wilsonjimenez-production.up.railway.app/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@mail.com", "bio": "Escritor con experiencia en novelas"}'

# Actualizar un autor
curl -X PUT https://proyectom2wilsonjimenez-production.up.railway.app/api/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Actualizado", "email": "juan@mail.com", "bio": "Escritor actualizado con mas experiencia"}'

# Eliminar un autor
curl -X DELETE https://proyectom2wilsonjimenez-production.up.railway.app/api/authors/1
```

### Posts

```bash
# Obtener todos los posts
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/posts

# Obtener posts de un autor
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/posts/authors/1

# Crear un post
curl -X POST https://proyectom2wilsonjimenez-production.up.railway.app/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post", "content": "Contenido del post suficientemente largo", "author_id": 1}'

# Publicar un post
curl -X PATCH https://proyectom2wilsonjimenez-production.up.railway.app/api/posts/publish/1

# Eliminar un post
curl -X DELETE https://proyectom2wilsonjimenez-production.up.railway.app/api/posts/1
```

### Comments

```bash
# Obtener todos los comentarios
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/comments

# Obtener comentarios de un post
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/comments/posts/1

# Obtener comentarios de un autor
curl https://proyectom2wilsonjimenez-production.up.railway.app/api/comments/authors/1

# Crear un comentario
curl -X POST https://proyectom2wilsonjimenez-production.up.railway.app/api/comments \
  -H "Content-Type: application/json" \
  -d '{"content": "Este es un comentario válido", "post_id": 1, "author_id": 2}'

# Actualizar un comentario
curl -X PUT https://proyectom2wilsonjimenez-production.up.railway.app/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"content": "Comentario actualizado"}'

# Eliminar un comentario
curl -X DELETE https://proyectom2wilsonjimenez-production.up.railway.app/api/comments/1
```

---

## Documentación interactiva

La API cuenta con documentación interactiva generada con Swagger UI donde puedes explorar y probar todos los endpoints directamente desde el navegador.

```
https://proyectom2wilsonjimenez-production.up.railway.app/api-docs
```

---

## Instalación local

### Requisitos previos

- Node.js v18 o superior
- PostgreSQL instalado y corriendo

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/wijimenezz/ProyectoM2_WilsonJimenez.git
cd api-blog

# 2. Instalar dependencias
npm install
```

### Configurar la base de datos

```bash
# 3. Crear la base de datos y el usuario en PostgreSQL
psql -U postgres -c "CREATE USER api_blog_user WITH PASSWORD 'api_blog_2026';"
psql -U postgres -c "CREATE DATABASE api_blog OWNER api_blog_user;"

# 4. Ejecutar el script SQL para crear las tablas
psql -U api_blog_user -d api_blog -f database/db.sql
```

### Configurar las variables de entorno

```bash
# 5. Crear el archivo .env en la raíz del proyecto con este contenido
DATABASE_LOCALURL=postgresql://USUARIO:CONTRASEÑA@localhost:PUERTO/NOMBRE_DB
NODE_ENV=development
PORT=3000
```

```bash
# 6. Correr el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Correr los tests

```bash
# Tests unitarios e integración
npm test

# Ver cobertura de código
npm run test:coverage
```

---

## Deploy en Railway

### 1. Crear el proyecto en Railway

- Crea una cuenta en [railway.app](https://railway.app)
- Crea un nuevo proyecto y conecta tu repositorio de GitHub
- Agrega un servicio de **PostgreSQL** desde el dashboard de Railway

### 2. Configurar las variables de entorno en Railway

Ve a tu servicio → **Variables** y agrega las siguientes:

| Variable       | Valor                                                   |
| -------------- | ------------------------------------------------------- |
| `DATABASE_URL` | Railway la genera automáticamente al agregar PostgreSQL |
| `NODE_ENV`     | `production`                                            |
| `PORT`         | `3000`                                                  |

> ⚠️ Railway inyecta `DATABASE_URL` automáticamente cuando agregas el servicio de PostgreSQL. No necesitas escribirla manualmente.

### 3. Ejecutar el script SQL en Railway

Una vez desplegado, ejecuta el script para crear las tablas. Ve al panel de Railway → PostgreSQL → **Query** y pega el contenido del archivo `database/db.sql`.

### 4. URLs del proyecto

| Tipo             | URL                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **API pública**  | `https://proyectom2wilsonjimenez-production.up.railway.app/api`                          |
| **Swagger UI**   | `https://proyectom2wilsonjimenez-production.up.railway.app/api-docs`                     |
| **Internal URL** | Disponible en Railway → PostgreSQL → **Connect** (solo para servicios dentro de Railway) |

---

## Estructura del proyecto

```
├── database/
│   └── db.sql                  — script de la base de datos
├── src/
│   ├── controllers/            — lógica de cada endpoint
│   │   ├── authorControllers.js
│   │   ├── commentsControllers.js
│   │   └── postsControllers.js
│   ├── Middlewares/            — validaciones y manejo de errores
│   │   ├── authorMiddlewares.js
│   │   ├── commentsMiddlewares.js
│   │   ├── globalMiddleware.js
│   │   └── postsMiddlewares.js
│   ├── routes/                 — definición de rutas
│   │   ├── authorRoutes.js
│   │   ├── commentsRoutes.js
│   │   ├── postsRoutes.js
│   │   └── index.js
│   ├── Services/               — consultas a la base de datos
│   │   ├── autorServices.js
│   │   ├── commentsServices.js
│   │   └── postsServices.js
│   ├── Tests/                  — tests unitarios e integración
│   │   ├── controllers/
│   │   ├── integration/
│   │   ├── middlewares/
│   │   └── services/
│   ├── app.js                  — configuración de Express
│   ├── db.js                   — conexión a PostgreSQL
│   └── server.js               — punto de entrada
├── .env.example                — variables de entorno de ejemplo
├── .gitignore
├── openapi.yaml                — documentación Swagger
├── package.json
├── README.md
└── vitest.config.js            — configuración de tests
```
