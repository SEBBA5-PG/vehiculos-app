# Evidencia de pruebas manuales de caja negra — CRUD /vehiculos

- **Fecha de ejecución:** 2026-10-07
- **Entorno:** NestJS 12 · Prisma 7.10 (driver adapter `@prisma/adapter-pg`) · PostgreSQL 17 en Supabase (Session pooler)
- **URL base:** `http://localhost:3000`
- **Cliente HTTP:** `curl` (script reproducible: `docs/pruebas-caja-negra.sh`)
- **Datos de prueba:** ficticios (Anexo A de la guía). Los registros creados se eliminaron al finalizar.

## 10.7 Tabla de ejecución

| Caso | Petición | Body enviado | Esperado | Obtenido | Estado | Respuesta (extracto) |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| TC-VEH-01 | `POST /vehiculos` | `{"placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"col…` | 201 | 201 | ✅ PASS | `{"id":"1","placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanco…` |
| TC-VEH-02 | `POST /vehiculos` | `{}` | 400 | 400 | ✅ PASS | `{"message":["placa must be shorter than or equal to 10 characters","placa should not be em…` |
| TC-VEH-03 | `POST /vehiculos` | `{"placa":"ABC123","marca":"Mazda","modelo":"3","anio":2025,"color":"Ro…` | 409 | 409 | ✅ PASS | `{"message":"Ya existe un vehículo con la placa ABC123","error":"Conflict","statusCode":409…` |
| TC-VEH-04 | `POST /vehiculos` | `{"placa":"XYZ987","marca":"Renault","modelo":"Logan","anio":2023,"colo…` | 400 | 400 | ✅ PASS | `{"message":["property propietario should not exist"],"error":"Bad Request","statusCode":40…` |
| TC-VEH-05 | `GET /vehiculos` | — | 200 | 200 | ✅ PASS | `[{"id":"1","placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanc…` |
| TC-VEH-06 | `GET /vehiculos/1` | — | 200 | 200 | ✅ PASS | `{"id":"1","placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanco…` |
| TC-VEH-07 | `GET /vehiculos/999999999` | — | 404 | 404 | ✅ PASS | `{"message":"Vehículo con id 999999999 no encontrado","error":"Not Found","statusCode":404}` |
| TC-VEH-08 | `GET /vehiculos/abc` | — | 400 | 400 | ✅ PASS | `{"message":"Validation failed (numeric string is expected)","error":"Bad Request","statusC…` |
| TC-VEH-09 | `PATCH /vehiculos/1` | `{"color":"Negro"}` | 200 | 200 | ✅ PASS | `{"id":"1","placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Negro"…` |
| TC-VEH-10 | `POST /vehiculos` | `{"placa":"LIM1949","marca":"Ford","modelo":"T","anio":1949}` | 400 | 400 | ✅ PASS | `{"message":["anio must not be less than 1950"],"error":"Bad Request","statusCode":400}` |
| TC-VEH-11 | `DELETE /vehiculos/1` | — | 204 | 204 | ✅ PASS | (sin cuerpo) |
| TC-VEH-12 | `DELETE /vehiculos/1` | — | 404 | 404 | ✅ PASS | `{"message":"Vehículo con id 1 no encontrado","error":"Not Found","statusCode":404}` |

> TC-VEH-09: una consulta `GET /vehiculos/:id` posterior confirmó que el cambio de `color` a `Negro` quedó persistido (200), sin alterar placa, marca, modelo ni año.

## 10.6 Valores límite para `anio` (regla 1950 ≤ anio ≤ 2100)

| Valor de anio | Esperado | Obtenido | Estado |
| :---: | :---: | :---: | :---: |
| 1949 | 400 | 400 | ✅ PASS |
| 1950 | 201 | 201 | ✅ PASS |
| 1951 | 201 | 201 | ✅ PASS |
| 2099 | 201 | 201 | ✅ PASS |
| 2100 | 201 | 201 | ✅ PASS |
| 2101 | 400 | 400 | ✅ PASS |

## Resumen

- **18 / 18 PASS** (12 casos TC-VEH + 6 valores límite).
- Placa duplicada → **409**, no 500: el error `P2002` de Prisma se traduce a `ConflictException`.
- El `id` (BIGINT) se serializa como string (`"id":"1"`), sin errores de BigInt en JSON.
- El salto de `id` 1 → 3 se debe a que el INSERT rechazado por la restricción UNIQUE (TC-VEH-03) consumió un valor de la secuencia BIGSERIAL. Es el comportamiento normal de PostgreSQL.
