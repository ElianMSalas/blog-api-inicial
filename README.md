# Blog API

API REST para gestión de un blog con posts, comentarios y autenticación basada en JWT.

## Stack

- Node.js + Express 
- MongoDB + Mongoose
- Autenticación con JWT y bcrypt
- Validación de datos con Zod
- Seguridad: Helmet, CORS, Rate Limiting
- Tests: Jest + Supertest + MongoDB Memory Server

## Instalación

```bash
git clone https://github.com/ElianMSalas/blog-api-inicial
cd blog-api
npm install
cp .env.example .env
# Completa las variables de entorno en .env
npm run dev
```

## Variables de entorno

| Variable        | Descripción                              |
|-----------------|-------------------------------------------|
| PORT            | Puerto del servidor (default: 3000)        |
| NODE_ENV        | development / production / test           |
| MONGODB_URI     | URI de conexión a MongoDB                  |
| JWT_SECRET      | Secreto para firmar tokens JWT             |
| JWT_EXPIRES_IN  | Tiempo de expiración del token (ej: 7d)    |

## Endpoints principales

### Auth
| Método | Ruta              | Descripción          | Auth |
|--------|-------------------|----------------------|------|
| POST   | /api/auth/register | Registrar usuario   | No   |
| POST   | /api/auth/login    | Iniciar sesión      | No   |

### Posts
| Método | Ruta              | Descripción              | Auth |
|--------|-------------------|---------------------------|------|
| GET    | /api/posts        | Listar posts publicados (paginado) | No |
| GET    | /api/posts/id/:id | Obtener post por ID       | No   |
| GET    | /api/posts/:slug  | Obtener post por slug     | No   |
| POST   | /api/posts        | Crear post                | Sí   |
| PATCH  | /api/posts/:slug  | Actualizar post propio     | Sí   |
| DELETE | /api/posts/:slug  | Eliminar post (propio o admin) | Sí |

### Comentarios
| Método | Ruta                              | Descripción              | Auth |
|--------|------------------------------------|---------------------------|------|
| GET    | /api/posts/:postId/comments        | Listar comentarios (paginado) | No |
| POST   | /api/posts/:postId/comments        | Crear comentario          | Sí   |
| PATCH  | /api/comments/:commentId           | Editar comentario propio   | Sí   |
| DELETE | /api/comments/:commentId           | Eliminar comentario (propio o admin) | Sí |

## Tests

```bash
npm test
```

## Health Check

```
GET /health
```