# Estándar de respuestas JSON

Todas las respuestas de la API, tanto de éxito como de error, siguen una misma estructura definida por la clase `ApiResponse<T>` (`src/shared/responses/api-response.ts`). Esta estructura se aplica automáticamente a todos los endpoints mediante un interceptor global (para respuestas exitosas) y un exception filter global (para errores), por lo que ningún controller necesita construir el formato de respuesta manualmente.

El tipo genérico `T` permite que el campo `data` represente tanto un objeto individual (por ejemplo, un estudiante) como una lista de objetos (por ejemplo, un arreglo de mascotas), sin necesidad de definir dos estructuras distintas.

## Estructura

```typescript
{
  success: boolean;
  error: { code: string; message: string } | null;
  data: T | null;
  meta: { timestamp: string; [key: string]: any };
}
```

| Campo     | Tipo                                         | Descripción                                                                 |
|-----------|-----------------------------------------------|-------------------------------------------------------------------------------|
| `success` | `boolean`                                     | `true` si la operación fue exitosa, `false` si hubo un error                  |
| `error`   | `{ code: string; message: string } \| null`    | Código específico + mensaje del error, o `null` si `success` es `true`        |
| `data`    | `T \| null`                                    | Los datos de la respuesta, o `null` si hubo un error                          |
| `meta`    | `{ timestamp: string; [key: string]: any }`    | Metadatos de la respuesta, incluyendo la fecha/hora en formato ISO            |

## Students

### Ejemplo de éxito (POST - /api/students)

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "3893b567-06b3-46f1-b30b-e6487d3390e6",
    "name": "Elias Cayuqueo",
    "email": "ecayuqueo2026@alu.uct.cl",
    "age": 23,
    "createdAt": "2026-08-29T00:19:42.899Z",
    "updatedAt": "2026-08-29T00:19:42.899Z"
  },
  "meta": {
    "timestamp": "2026-08-29T00:19:42.900Z"
  }
}
```

### Ejemplo de error (GET - /api/students/{id})

```json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Estudiante no encontrado"
  },
  "data": null,
  "meta": {
    "timestamp": "2026-08-29T00:25:43.435Z"
  }
}
```

## Pets

### Ejemplo de éxito (POST - /api/students/{studentId}/pets)

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "27a3d294-e671-4806-bc07-98939c330ad6",
    "studentId": "3893b567-06b3-46f1-b30b-e6487d3390e6",
    "name": "michi",
    "species": "Gato",
    "age": 2,
    "createdAt": "2026-08-29T00:29:38.711Z",
    "updatedAt": "2026-08-29T00:29:38.711Z"
  },
  "meta": {
    "timestamp": "2026-08-29T00:29:38.711Z"
  }
}
```

### Ejemplo de error (GET - /api/students/{studentId}/pets)

```json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Estudiante no encontrado"
  },
  "data": null,
  "meta": {
    "timestamp": "2026-08-29T00:33:16.590Z"
  }
}
```

## Códigos de error por entidad

| Código                          | Cuándo ocurre                                                       |
|-----------------------------------|------------------------------------------------------------------------|
| `STUDENT_NOT_FOUND`             | El `id` de estudiante no existe                                       |
| `STUDENT_EMAIL_ALREADY_EXISTS`  | El email ya está registrado en otro estudiante                        |
| `PET_NOT_FOUND`                 | El `petId` no existe, o no pertenece al `studentId` indicado          |

## Implementación por entidad

La aplicación del estándar en cada entidad fue distribuida entre los integrantes del grupo, cada uno trabajando en su propia rama sobre el archivo de servicio correspondiente.

### Students (`src/students/students.service.ts`)

Se revisaron los métodos `findById`, `update`, `delete` y `create`, agregando validaciones que antes no diferenciaban el tipo de error:

- `findById`: si el `id` no existe, se lanza `NotFoundException` con código `STUDENT_NOT_FOUND` (en lugar de un mensaje genérico). Como `update` y `delete` reutilizan `findById` internamente, quedaron cubiertos con el mismo cambio.
- `assertEmailAvailable` (usado por `create` y `update`): si el email ya está registrado, se lanza `ConflictException` con código `STUDENT_EMAIL_ALREADY_EXISTS`.

### Pets (`src/pets/pets.service.ts`)

Se revisó el método `findOwned`, usado internamente por `update` y `delete`:

- Si el `petId` no existe, o existe pero no pertenece al `studentId` indicado, se lanza `NotFoundException` con código `PET_NOT_FOUND`.
- Adicionalmente, todos los métodos de `pets` (`findAllForStudent`, `create`, `update`, `delete`) validan primero que el `studentId` exista, reutilizando `StudentsService.findById`. Por eso, un `studentId` inexistente en cualquier endpoint de mascotas también devuelve `STUDENT_NOT_FOUND`.

En ambos casos, el cambio consistió en reemplazar el argumento de texto plano de la excepción por un objeto `{ error: "CODIGO", message: "texto" }`, que el exception filter global toma y coloca directamente en el campo `error.code` de la respuesta.
