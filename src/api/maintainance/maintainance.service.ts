import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintainanceDto } from './dto/create-maintainance.dto';
import { UpdateMaintainanceDto } from './dto/update-maintainance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReturnMessage } from 'src/shared/enum/return-message.enum';
import { StaticRole } from '../user/dto/static-role.enum';
import { MaintainanceFilter } from './dto/maintainance-filter';
import { paginateResponse } from 'src/shared/paginate-response';
import { MaintenanceTasks } from 'generated/prisma';

@Injectable()
export class MaintainanceService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateMaintainanceDto) {
    try {
      const customer = await this.prismaService.customers.findUnique({
        where: { id: data.customerId },
      });
      if (!customer) {
        throw new NotFoundException(ReturnMessage.CUSTOMER_NOT_FOUND);
      }

      const assignedTo = await this.prismaService.users.findUnique({
        where: { id: data.assignedToId },
      });
      if (!assignedTo || assignedTo.role !== StaticRole.TECHNICIAN) {
        throw new NotFoundException(ReturnMessage.TECHNICIAN_NOT_FOUND);
      }

      const { customerId, assignedToId, ...maintainanceData } = data;
      const maintainanceCreateData: any = {
        ...maintainanceData,
        customer: { connect: { id: customerId } },
        assignedTo: { connect: { id: assignedToId } },
      };

      if (maintainanceCreateData.nextMaintenance) {
        maintainanceCreateData.nextMaintenance = new Date(
          maintainanceCreateData.nextMaintenance,
        );
      }

      if (maintainanceCreateData.nextMaintenance === undefined) {
        delete maintainanceCreateData.nextMaintenance;
      }
      return await this.prismaService.maintenanceTasks.create({
        data: maintainanceCreateData,
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการสร้างการบำรุงรักษา: ${error.message}`,
      );
    }
  }

  async findAll(
    query: MaintainanceFilter,
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
        this.prismaService.maintenanceTasks.findMany({
          where,
          skip,
          take: +limit,
          orderBy: { id: 'asc' },
          include: {
            customer: true,
            assignedTo: true,
          },
        }),
        this.prismaService.maintenanceTasks.count({ where }),
      ]);
      return paginateResponse(data, total, +page, +limit);
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการดึงข้อมูลการบำรุงรักษา: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<MaintenanceTasks | null> {
    try {
      return await this.prismaService.maintenanceTasks.findUnique({
        where: { id },
        include: {
          customer: true,
          assignedTo: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการค้นหาการบำรุงรักษา: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateMaintenanceDto: UpdateMaintainanceDto,
  ): Promise<MaintenanceTasks> {
    try {
      const checkCustomer =
        await this.prismaService.maintenanceTasks.findUnique({
          where: { id },
        });
      if (!checkCustomer) {
        throw new NotFoundException(ReturnMessage.MAINTENANCE_NOT_FOUND);
      }
      if (updateMaintenanceDto.customerId) {
        const customer = await this.prismaService.customers.findUnique({
          where: { id: updateMaintenanceDto.customerId },
        });
        if (!customer) {
          throw new NotFoundException(ReturnMessage.CUSTOMER_NOT_FOUND);
        }
      }

      if (updateMaintenanceDto.assignedToId) {
        const technician = await this.prismaService.users.findUnique({
          where: { id: updateMaintenanceDto.assignedToId },
        });
        if (!technician || technician.role !== StaticRole.TECHNICIAN) {
          throw new NotFoundException(ReturnMessage.TECHNICIAN_NOT_FOUND);
        }
      }

      return await this.prismaService.maintenanceTasks.update({
        where: { id },
        data: updateMaintenanceDto,
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการอัปเดตการบำรุงรักษา: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<MaintenanceTasks> {
    try {
      const maintenance = await this.prismaService.maintenanceTasks.findUnique({
        where: { id },
      });
      if (!maintenance) {
        throw new NotFoundException(ReturnMessage.MAINTENANCE_NOT_FOUND);
      }
      return await this.prismaService.maintenanceTasks.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(
        `${ReturnMessage.ERROR} ในการลบการบำรุงรักษา: ${error.message}`,
      );
    }
  }
}
