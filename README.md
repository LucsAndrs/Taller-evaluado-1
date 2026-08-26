# CRUD Students

Proyecto NestJS que implementa un **CRUD en memoria** para la entidad `Student`. No requiere base de datos ni contenedores: los datos viven en un `Map` dentro del servicio y se pierden al reiniciar la aplicación.

## Requerimientos

- Node.js 20+ (probado con Node 24)
- pnpm

## Resumen funcional

La API expone operaciones CRUD completas sobre estudiantes bajo `/api/students`:

- **Crear**: `POST /api/students`
- **Listar**: `GET /api/students`
- **Buscar por id**: `GET /api/students/:id`
- **Actualizar**: `PATCH /api/students/:id`
- **Eliminar**: `DELETE /api/students/:id`

Cada estudiante tiene `id` (UUID), `name`, `email`, `age`, `createdAt` y `updatedAt`. El `email` es único: se rechaza con `409 Conflict` si ya existe.

La validación de entrada se realiza con `class-validator` a través de un `ValidationPipe` global:

- `name`: texto de 3 a 100 caracteres, sin etiquetas HTML.
- `email`: dirección de correo electrónico válida.
- `age`: entero entre 18 y 99.

## Contexto técnico

- **Backend**: NestJS
- **Almacenamiento**: en memoria (sin persistencia)
- **Validación**: `class-validator` + `class-transformer`
- **Documentación**: Swagger en `/docs`

## Ejecución local

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Levantar el servidor en modo desarrollo:

   ```bash
   pnpm run start:dev
   ```

   O usando Make:

   ```bash
   make install
   make dev
   ```

La aplicación queda disponible en:

- `http://localhost:3000`
- `http://localhost:3000/docs`

## Comandos útiles

- `make dev` — arranca NestJS en modo watch
- `make build` — compila el proyecto
- `make lint` — ejecuta ESLint
- `make format` — formatea el código
- `make format-check` — verifica el formato
- `make clean` — elimina `dist`, `coverage` y `node_modules`
