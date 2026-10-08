# Guía: cómo probar los endpoints de /vehiculos

Primero arranca la API (deja esta terminal abierta):

```bash
cd backend
npm run start:dev
```

Cuando veas `Nest application successfully started`, la API está en `http://localhost:3000`.
Elige **una** de las opciones siguientes. Todas ejecutan los mismos casos TC-VEH de la sección 10.

---

## Opción 1 · Swagger en el navegador (Safari, Chrome…) — sin instalar nada

1. Abre **http://localhost:3000/api**.
2. Despliega un endpoint, por ejemplo `POST /vehiculos`.
3. Pulsa **Try it out**, edita el JSON de ejemplo y pulsa **Execute**.
4. Revisa **Server response**, que muestra el código HTTP y el cuerpo de la respuesta.
5. Para `GET/PATCH/DELETE /vehiculos/{id}`, escribe en el campo `id` el valor que devolvió el POST (por ejemplo `"id": "7"` → `7`).

Casos para reproducir en Swagger:

| Caso | Endpoint | Qué escribir | Esperado |
| :--- | :--- | :--- | :---: |
| TC-VEH-01 | POST /vehiculos | `{"placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanco"}` | 201 |
| TC-VEH-02 | POST /vehiculos | `{}` | 400 |
| TC-VEH-03 | POST /vehiculos | el mismo JSON de TC-VEH-01 otra vez | 409 |
| TC-VEH-04 | POST /vehiculos | TC-VEH-01 con placa nueva + `"propietario":"x"` | 400 |
| TC-VEH-05 | GET /vehiculos | — | 200 |
| TC-VEH-06 | GET /vehiculos/{id} | id creado | 200 |
| TC-VEH-07 | GET /vehiculos/{id} | `999999999` | 404 |
| TC-VEH-08 | GET /vehiculos/{id} | `abc` | 400 |
| TC-VEH-09 | PATCH /vehiculos/{id} | id creado + `{"color":"Negro"}` | 200 |
| TC-VEH-10 | POST /vehiculos | `"anio": 1949` | 400 |
| TC-VEH-11 | DELETE /vehiculos/{id} | id creado | 204 |
| TC-VEH-12 | DELETE /vehiculos/{id} | el mismo id otra vez | 404 |

> El JSON de la especificación también está en http://localhost:3000/api-json. Se puede importar en Postman, Insomnia o Bruno.

---

## Opción 2 · Extensión REST Client en Antigravity / VS Code / Cursor

1. En **Extensions**, busca **REST Client** (autor *Huachao Mao*) e instálala. Está en el marketplace de VS Code y en Open VSX (el que usan Antigravity y Cursor).
2. Abre [`backend/requests/vehiculos.http`](../requests/vehiculos.http).
3. Sobre cada bloque aparece el enlace **Send Request**. Púlsalo **en orden, de arriba hacia abajo**.
4. La respuesta se abre en un panel lateral.
5. El `id` del TC-VEH-01 se captura solo (`{{crear.response.body.id}}`) y se reutiliza en las peticiones siguientes.
6. Si `ABC123` ya existe en la base, cambia `@placa` al inicio del archivo.

> Alternativa con interfaz gráfica: la extensión **Thunder Client**. Ve a *Collections → Import* y elige `requests/vehiculos.postman_collection.json`.

---

## Opción 3 · Postman / Insomnia / Bruno (colección con aserciones automáticas)

1. Abre la app y ve a **Import** → [`backend/requests/vehiculos.postman_collection.json`](../requests/vehiculos.postman_collection.json).
2. Abre la colección **CRUD Vehículos · Caja negra** y ejecútala con **Run collection**.
3. Cada petición trae tests que muestran ✅/❌ (código HTTP, id como string, persistencia del PATCH…).
4. La placa se genera sola en cada ejecución, y al final se borran los registros creados, así que la colección se puede repetir sin problemas.

Sin instalar Postman, la misma colección corre por terminal:

```bash
npx newman run requests/vehiculos.postman_collection.json
```

Resultado verificado: 18 peticiones, 23 aserciones, 0 fallos.

---

## Opción 4 · Terminal (curl)

```bash
curl -i http://localhost:3000/vehiculos
curl -i -X POST http://localhost:3000/vehiculos -H "Content-Type: application/json" \
  -d '{"placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanco"}'
```

Todos los casos de una vez: `./docs/pruebas-caja-negra.sh salida.txt`

---

## Opción 5 · Pruebas automatizadas (no necesita la API corriendo)

```bash
npm run test:e2e
```

Ejecuta los 8 casos TC-AUTO con Vitest + Supertest contra la base real y limpia sus datos.

---

## Registro de evidencia

Anota cada resultado en la tabla de la sección 10.7 (Caso · Esperado · Obtenido · PASS/FAIL).
Ejemplo ya diligenciado: [`evidencia-pruebas-manuales.md`](evidencia-pruebas-manuales.md).
**No** incluyas la `DATABASE_URL` ni la contraseña en capturas de pantalla.
