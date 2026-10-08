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
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placa: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  marca: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modelo: string;

  @IsInt()
  @Min(1950)
  @Max(2100)
  anio: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;
}
