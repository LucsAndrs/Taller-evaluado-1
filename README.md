# Estandar de respuestas JSON

Todas las respuestas de la API, tanto de éxito como de error, siguen una misma estructura definida por la clase ApiResponse (src/shared/responses/api-response.ts). Esta estructura se aplica automáticamente a todos los endpoints mediante un interceptor global (para respuestas exitosas) y un exception filter global (para errores), por lo que ningún controller necesita construir el formato de respuesta manualmente.

## Estructura

```
{
  success: boolean;
  error: { code: string; message: string } | null;
  data: T | null;
  meta: { timestamp: string; [key: string]: any };
}
```

success: Detalle, es un booleano que devuelve True si la operacion fue exitosa, o False si hubo un error.
error: Detalle, es un string que devuelve un codigo especifico + un mensajes o null si success es True.
data: Detalles, los datos de la respuesta o null si hubo un error
meta: Detalle, metadatos de la respuesta, incluye la fecha y hora en formato ISO

## Student

## Ejemplo de exito (POST- /api/students)

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

## Ejemplo de error (GET- /api/students/{id})

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

## Ejemplo de exito (POST- /api/students/{studentId}/pets)

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

## Ejemplo de error (GET- /api/students/{studentId}/pets)

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

## Implementación por entidad

Implementación por entidad

Students (src/students/students.service.ts)
Se revisaron los métodos findById, update, delete y create, agregando validaciones que antes no diferenciaban el tipo de error:

findById: si el id no existe, se lanza NotFoundException con código STUDENT_NOT_FOUND (en lugar de un mensaje genérico). Como update y delete reutilizan findById internamente, quedaron cubiertos con el mismo cambio.
assertEmailAvailable (usado por create y update): si el email ya está registrado, se lanza ConflictException con código STUDENT_EMAIL_ALREADY_EXISTS.

Pets (src/pets/pets.service.ts)
Se revisó el método findOwned, usado internamente por update y delete:

Si el petId no existe, o existe pero no pertenece al studentId indicado, se lanza NotFoundException con código PET_NOT_FOUND.
Adicionalmente, todos los métodos de pets (findAllForStudent, create, update, delete) validan primero que el studentId exista, reutilizando StudentsService.findById. Por eso, un studentId inexistente en cualquier endpoint de mascotas también devuelve STUDENT_NOT_FOUND.

En ambos casos, el cambio consistió en reemplazar el argumento de texto plano de la excepción por un objeto { error: "CODIGO", message: "texto" }, que el exception filter global toma y coloca directamente en el campo error.code de la respuesta.
