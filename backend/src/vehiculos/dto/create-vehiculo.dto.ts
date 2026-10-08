import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// Límites alineados con la tabla vehiculos en PostgreSQL.
export class CreateVehiculoDto {
  @ApiProperty({ example: 'ABC123', maxLength: 10, description: 'Única' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placa: string;

  @ApiProperty({ example: 'Toyota', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  marca: string;

  @ApiProperty({ example: 'Corolla', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modelo: string;

  @ApiProperty({ example: 2024, minimum: 1950, maximum: 2100 })
  @IsInt()
  @Min(1950)
  @Max(2100)
  anio: number;

  @ApiPropertyOptional({ example: 'Blanco', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;
}
