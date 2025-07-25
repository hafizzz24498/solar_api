import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';
import { Customers } from 'generated/prisma/wasm';

@UseGuards(JwtAuthGuard)
@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customers> {
    return this.customerService.create(createCustomerDto);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() query: CustomerFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<Customers | null> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customers> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<Customers | null> {
    return this.customerService.remove(id);
  }
}
