import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import type { vehiculos as VehiculoRow } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto.js';

// El id es BIGINT en PostgreSQL; JSON no serializa BigInt, por eso se expone como string.
export type Vehiculo = Omit<VehiculoRow, 'id'> & { id: string };

@Injectable()
export class VehiculosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVehiculoDto): Promise<Vehiculo> {
    try {
      const vehiculo = await this.prisma.vehiculos.create({ data: dto });
      return this.toResponse(vehiculo);
    } catch (error) {
      this.handleError(error, dto.placa);
    }
  }

  async findAll(): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculos.findMany({
      orderBy: { id: 'asc' },
    });
    return vehiculos.map((v) => this.toResponse(v));
  }

  async findOne(id: number): Promise<Vehiculo> {
    const vehiculo = await this.prisma.vehiculos.findUnique({
      where: { id: BigInt(id) },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
    }
    return this.toResponse(vehiculo);
  }

  async update(id: number, dto: UpdateVehiculoDto): Promise<Vehiculo> {
    try {
      const vehiculo = await this.prisma.vehiculos.update({
        where: { id: BigInt(id) },
        data: Object.assign({}, dto, { updated_at: new Date() }),
      });
      return this.toResponse(vehiculo);
    } catch (error) {
      this.handleError(error, dto.placa, id);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.vehiculos.delete({ where: { id: BigInt(id) } });
    } catch (error) {
      this.handleError(error, undefined, id);
    }
  }

  private toResponse(vehiculo: VehiculoRow): Vehiculo {
    return { ...vehiculo, id: vehiculo.id.toString() };
  }

  // Traduce errores de Prisma a respuestas HTTP de dominio (409 / 404).
  private handleError(error: unknown, placa?: string, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un vehículo con la placa ${placa}`,
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
      }
    }
    throw error;
  }
}
