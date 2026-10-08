import { PartialType } from '@nestjs/swagger';
import { CreateVehiculoDto } from './create-vehiculo.dto.js';

// Todos los campos opcionales para permitir actualizaciones parciales (PATCH).
// PartialType de @nestjs/swagger conserva las validaciones y la documentación.
export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {}
