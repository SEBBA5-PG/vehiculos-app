import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

// Aislamiento de datos: cada ejecución usa un prefijo de placa único (E2 + 4 caracteres).
// Cada prueba crea sus propios vehículos y al final se eliminan solo los de este prefijo.
const RUN = 'E2' + Math.random().toString(36).slice(2, 6).toUpperCase();
let seq = 0;
const nuevaPlaca = () => `${RUN}${String(++seq).padStart(2, '0')}`;
const vehiculoValido = () => ({
  placa: nuevaPlaca(),
  marca: 'Toyota',
  modelo: 'Corolla',
  anio: 2024,
  color: 'Blanco',
});

describe('CRUD /vehiculos (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Misma configuración de validación que src/main.ts.
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.vehiculos.deleteMany({ where: { placa: { startsWith: RUN } } });
    await app.close();
  });

  const crear = (body: object) =>
    request(app.getHttpServer()).post('/vehiculos').send(body);

  it('TC-AUTO-01: POST válido devuelve 201', async () => {
    const body = vehiculoValido();
    const res = await crear(body).expect(201);

    expect(res.body).toMatchObject(body);
    expect(typeof res.body.id).toBe('string');
  });

  it('TC-AUTO-02: POST sin placa devuelve 400', async () => {
    const { placa: _omitida, ...sinPlaca } = vehiculoValido();
    await crear(sinPlaca).expect(400);
  });

  it('TC-AUTO-03: placa duplicada devuelve 409', async () => {
    const body = vehiculoValido();
    await crear(body).expect(201);

    await crear({ ...body, marca: 'Mazda', modelo: '3', anio: 2025 }).expect(
      409,
    );
  });

  it('TC-AUTO-04: propiedad extra devuelve 400', async () => {
    await crear({ ...vehiculoValido(), propietario: 'no-permitido' }).expect(
      400,
    );
  });

  it('TC-AUTO-05: GET listado devuelve 200 y un arreglo', async () => {
    const creado = await crear(vehiculoValido()).expect(201);

    const res = await request(app.getHttpServer()).get('/vehiculos').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.map((v: { id: string }) => v.id)).toContain(
      creado.body.id,
    );
  });

  it('TC-AUTO-06: GET de ID inexistente devuelve 404', async () => {
    const creado = await crear(vehiculoValido()).expect(201);
    await request(app.getHttpServer())
      .delete(`/vehiculos/${creado.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/vehiculos/${creado.body.id}`)
      .expect(404);
  });

  it('TC-AUTO-07: PATCH parcial actualiza únicamente los campos enviados', async () => {
    const body = vehiculoValido();
    const creado = await crear(body).expect(201);

    await request(app.getHttpServer())
      .patch(`/vehiculos/${creado.body.id}`)
      .send({ color: 'Rojo' })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/vehiculos/${creado.body.id}`)
      .expect(200);
    expect(res.body).toMatchObject({ ...body, color: 'Rojo' });
  });

  it('TC-AUTO-08: DELETE existente devuelve 204 y luego GET devuelve 404', async () => {
    const creado = await crear(vehiculoValido()).expect(201);

    await request(app.getHttpServer())
      .delete(`/vehiculos/${creado.body.id}`)
      .expect(204);
    await request(app.getHttpServer())
      .get(`/vehiculos/${creado.body.id}`)
      .expect(404);
  });
});
