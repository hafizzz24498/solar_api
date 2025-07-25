import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customers } from 'generated/prisma/wasm';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';
import { ReturnMessage } from 'src/shared/enum/return-message.enum';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createCustomerDto: CreateCustomerDto): Promise<Customers> {
    const customerData = {
      ...createCustomerDto,
    };

    return this.prismaService.customers.create({
      data: customerData,
    });
  }

  async findAll(
    query: CustomerFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    try {
      const { page = 1, limit = 10, ...filter } = query;
      const skip = (page - 1) * limit;
      const where: any = {
        ...filter,
        name: filter.name
          ? { contains: filter.name, mode: 'insensitive' }
          : undefined,
      };

      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.customers.findMany({
          where,
          skip,
          take: +limit,
          orderBy: { id: 'asc' },
        }),
        this.prismaService.customers.count({ where }),
      ]);
      return paginateResponse(data, total, +page, +limit);
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการดึงข้อมูลผู้ใช้: ${error.message}`,
      );
    }
  }

  findOne(id: string): Promise<Customers | null> {
    try {
      return this.prismaService.customers.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการดึงข้อมูลผู้ใช้: ${error.message}`,
      );
    }
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customers> {
    try {
      var customer = this.findOne(id);
      if (!customer) {
        throw new BadRequestException(
          `${ReturnMessage.ERROR} ไม่พบผู้ใช้ที่มี ID: ${id}`,
        );
      }

      const updateData = {
        ...updateCustomerDto,
        ...(updateCustomerDto.lastCleanDate && {
          lastCleanDate: new Date(updateCustomerDto.lastCleanDate),
        }),
      };

      return this.prismaService.customers.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการอัพเดตข้อมูลผู้ใช้: ${error.message}`,
      );
    }
  }

  remove(id: string): Promise<Customers | null> {
    try {
      var customer = this.findOne(id);
      if (!customer) {
        throw new BadRequestException(
          `${ReturnMessage.ERROR} ไม่พบผู้ใช้ที่มี ID: ${id}`,
        );
      }
      return this.prismaService.customers.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการลบข้อมูลผู้ใช้: ${error.message}`,
      );
    }
  }
}
