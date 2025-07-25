import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InstallationService } from './installation.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { Installations } from 'generated/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InstallationFilterDto } from './dto/installation-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';

@Controller('installations')
@ApiTags('Installations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createInstallationDto: CreateInstallationDto,
  ): Promise<Installations> {
    return this.installationService.create(createInstallationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: InstallationFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    const installations = await this.installationService.findAll(query);
    return installations;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Installations | null> {
    const installation = await this.installationService.findOne(id);
    if (!installation) {
      return null;
    }
    return installation;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateInstallationDto: UpdateInstallationDto,
  ): Promise<Installations> {
    return await this.installationService.update(id, updateInstallationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Installations> {
    return await this.installationService.remove(id);
  }
}
