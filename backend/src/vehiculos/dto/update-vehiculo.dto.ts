import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculoDto } from './create-vehiculo.dto.js';

// Todos los campos opcionales para permitir actualizaciones parciales (PATCH).
export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {}
