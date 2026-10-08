import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto.js';
import { VehiculosService } from './vehiculos.service.js';

@ApiTags('vehiculos')
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Vehículo creado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos extra' })
  @ApiConflictResponse({ description: 'Placa duplicada' })
  create(@Body() dto: CreateVehiculoDto) {
    return this.vehiculosService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Listado de vehículos' })
  findAll() {
    return this.vehiculosService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Vehículo encontrado' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Vehículo inexistente' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Vehículo actualizado' })
  @ApiBadRequestResponse({ description: 'Datos o ID inválidos' })
  @ApiNotFoundResponse({ description: 'Vehículo inexistente' })
  @ApiConflictResponse({ description: 'Placa duplicada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Vehículo eliminado' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Vehículo inexistente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.remove(id);
  }
}
