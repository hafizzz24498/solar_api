import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Installations } from 'generated/prisma';
import { ReturnMessage } from 'src/shared/enum/return-message.enum';
import { InstallationFilterDto } from './dto/installation-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';
import { StaticRole } from '../user/dto/static-role.enum';

@Injectable()
export class InstallationService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateInstallationDto): Promise<Installations> {
    try {
      const customer = await this.prismaService.customers.findUnique({
        where: { id: data.customerId },
      });
      if (!customer) {
        throw new NotFoundException(ReturnMessage.CUSTOMER_NOT_FOUND);
      }

      const technician = await this.prismaService.users.findUnique({
        where: { id: data.technicianId },
      });
      if (!technician || technician.role !== StaticRole.TECHNICIAN) {
        throw new NotFoundException(ReturnMessage.TECHNICIAN_NOT_FOUND);
      }
      const { customerId, technicianId, ...installationData } = data;
      const installationCreateData: any = {
        ...installationData,
        customer: { connect: { id: customerId } },
        technician: { connect: { id: technicianId } },
      };
      
      // Convert nextMaintenance string to Date if provided
      if (installationCreateData.nextMaintenance) {
        installationCreateData.nextMaintenance = new Date(installationCreateData.nextMaintenance);
      }
      
      if (installationCreateData.nextMaintenance === undefined) {
        delete installationCreateData.nextMaintenance;
      }
      return await this.prismaService.installations.create({
        data: installationCreateData,
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการสร้างการติดตั้ง: ${error.message}`,
      );
    }
  }

  async findAll(
    query: InstallationFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    try {
      const { page = 1, limit = 10, ...filter } = query;
      const skip = (page - 1) * limit;
      const where: any = {
        ...filter,
        status: filter.status
          ? { contains: filter.status, mode: 'insensitive' }
          : undefined,
      };

      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.installations.findMany({
          where,
          skip,
          take: +limit,
          orderBy: { id: 'asc' },
          include: {
            customer: true, technician: true,}
        }),
        this.prismaService.installations.count({ where }),
      ]);
      return paginateResponse(data, total, +page, +limit);
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการดึงข้อมูลการติดตั้ง: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Installations | null> {
    try {
      return await this.prismaService.installations.findUnique({
        where: { id },
        include: {
          customer: true,
          technician: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการค้นหาการติดตั้ง: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateInstallationDto: UpdateInstallationDto,
  ): Promise<Installations> {
    try {
      const checkCustomer = await this.prismaService.installations.findUnique({
        where: { id },
      });
      if (!checkCustomer) {
        throw new NotFoundException(ReturnMessage.INSTALLATION_NOT_FOUND);
      }
      if (updateInstallationDto.customerId) {
        const customer = await this.prismaService.customers.findUnique({
          where: { id: updateInstallationDto.customerId },
        });
        if (!customer) {
          throw new NotFoundException(ReturnMessage.CUSTOMER_NOT_FOUND);
        }
      }

      if (updateInstallationDto.technicianId) {
        const technician = await this.prismaService.users.findUnique({
          where: { id: updateInstallationDto.technicianId },
        });
        if (!technician || technician.role !== StaticRole.TECHNICIAN) {
          throw new NotFoundException(ReturnMessage.TECHNICIAN_NOT_FOUND);
        }
      }

      return await this.prismaService.installations.update({
        where: { id },
        data: updateInstallationDto,
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการอัปเดตการติดตั้ง: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Installations> {
    try {
      const installation = await this.prismaService.installations.findUnique({
        where: { id },
      });
      if (!installation) {
        throw new NotFoundException(ReturnMessage.INSTALLATION_NOT_FOUND);
      }
      return await this.prismaService.installations.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการลบการติดตั้ง: ${error.message}`,
      );
    }
  }
}
