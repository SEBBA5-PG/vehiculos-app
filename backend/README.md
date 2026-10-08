# vehiculos-app · backend

CRUD REST de vehículos con **NestJS 12 + Prisma 7 (driver adapter `pg`) + PostgreSQL en Supabase**.
Arquitectura: `Controller -> Service -> PrismaService`.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # pegar la URI del Session pooler de Supabase (sin corchetes en la contraseña)
npx prisma generate       # genera el cliente en src/generated/prisma (ignorado en Git)
npm run build
npm run start:dev         # http://localhost:3000
```

> La tabla `vehiculos` ya existe en Supabase. El modelo se obtuvo con `npx prisma db pull`.
> **No** se usan `prisma migrate` ni `prisma db push`.

## API

| Método | Ruta | Acción | Respuestas |
| :--- | :--- | :--- | :--- |
| POST | `/vehiculos` | crear | 201 · 400 inválido · 409 placa duplicada |
| GET | `/vehiculos` | listar | 200 arreglo |
| GET | `/vehiculos/:id` | consultar | 200 · 400 id inválido · 404 |
| PATCH | `/vehiculos/:id` | actualizar parcialmente | 200 · 400 · 404 · 409 |
| DELETE | `/vehiculos/:id` | eliminar | 204 · 400 · 404 |

Reglas: `placa` obligatoria y única (≤10), `marca` y `modelo` obligatorias (≤50), `anio` entero entre 1950 y 2100, `color` opcional (≤30).
El `id` (BIGINT) se devuelve como string.

## Pruebas

```bash
npm run test:e2e                          # 8 casos TC-AUTO (Vitest + Supertest) contra la BD real
./docs/pruebas-caja-negra.sh salida.txt   # casos manuales TC-VEH con curl (API corriendo)
```

- Evidencia manual: [`docs/evidencia-pruebas-manuales.md`](docs/evidencia-pruebas-manuales.md).
- NestJS 12 trae **Vitest** en lugar de Jest. La API (`describe`/`it`/`expect`) es equivalente, y Supertest se usa igual que en la guía.
- Aislamiento de datos: cada ejecución usa un prefijo de placa único (`E2xxxx..`). Al terminar se eliminan solo esos registros.

## Checkpoint final (sección 12)

| Control | Criterio de cierre | Estado |
| :--- | :--- | :---: |
| Compilación | `npm run build` sin errores | ✅ |
| Arranque | NestJS registra las cinco rutas `/vehiculos` | ✅ |
| Create | POST válido → 201 | ✅ |
| Read | GET lista y consulta | ✅ |
| Update | PATCH actualiza parcialmente | ✅ |
| Delete | DELETE → 204 | ✅ |
| Validación | DTOs rechazan cuerpo inválido y campos extra | ✅ |
| Integridad | Placa duplicada → 409, no 500 | ✅ |
| Errores | ID inválido → 400; inexistente → 404 | ✅ |
| JSON | BIGINT serializado como string | ✅ |
| Seguridad | Sin credenciales en código ni en Git (`.env` ignorado) | ✅ |
| Evidencia | 18/18 casos manuales PASS · 8/8 TC-AUTO PASS | ✅ |
