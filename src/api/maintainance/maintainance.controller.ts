import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MaintainanceService } from './maintainance.service';
import { CreateMaintainanceDto } from './dto/create-maintainance.dto';
import { UpdateMaintainanceDto } from './dto/update-maintainance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaintainanceFilter } from './dto/maintainance-filter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaintenanceTasks } from 'generated/prisma';
import { paginateResponse } from 'src/shared/paginate-response';

@Controller('maintainances')
@ApiTags('maintainance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MaintainanceController {
  constructor(private readonly maintainanceService: MaintainanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMaintainanceDto: CreateMaintainanceDto): Promise<MaintenanceTasks> {
    return await this.maintainanceService.create(createMaintainanceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: MaintainanceFilter): Promise<ReturnType<typeof paginateResponse>> {
    const maintainances = await this.maintainanceService.findAll(query);
    return maintainances;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<MaintenanceTasks | null> {
    return await this.maintainanceService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateMaintainanceDto: UpdateMaintainanceDto) : Promise<MaintenanceTasks> {
    return await this.maintainanceService.update(id, updateMaintainanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<MaintenanceTasks> {
    return await this.maintainanceService.remove(id);
  }
}
