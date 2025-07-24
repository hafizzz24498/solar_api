import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dto/user-create.dto';
import { ReturnMessage } from 'src/shared/enum/return-message.enum';
import * as bcrypt from 'bcrypt';
import { StaticRole } from './dto/static-role.enum';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: UserCreateDto): Promise<Users> {
    if (
      data.role !== StaticRole.ADMIN &&
      data.role !== StaticRole.TECHNICIAN &&
      data.role !== StaticRole.SUB_TECHNICIAN
    ) {
      throw new BadRequestException(ReturnMessage.INVALID_ROLE);
    }

    var findDuplicateUsename = await this.getUserByUsername(data.username);

    if (findDuplicateUsename != null) {
      throw new BadRequestException(ReturnMessage.DUPLICATE_USERNAME);
    }

    if (
      data.parentId !== null &&
      data.parentId !== undefined &&
      data.role === StaticRole.SUB_TECHNICIAN
    ) {
      const parentUser = await this.getUserById(data.parentId);
      if (!parentUser || parentUser.role !== StaticRole.TECHNICIAN) {
        throw new BadRequestException(
          `${ReturnMessage.NOT_FOUND} ผู้ใช้ที่เป็นผู้ตำแน่งสูงกว่า`,
        );
      }
    }

    if (
      (data.role === StaticRole.ADMIN || data.role === StaticRole.TECHNICIAN) &&
      data.parentId !== null &&
      data.parentId !== undefined
    ) {
      throw new BadRequestException(
        `${ReturnMessage.NOT_REQUIRED} parentId สำหรับผู้ใช้ที่มีตำแหน่ง ${data.role}`,
      );
    }

    return this.prismaService.users.create({
      data: {
        ...data,
        password: await this.getHashPassword(data.password),
      },
    });
  }

  async getUserById(id: string): Promise<Users | null> {
    return this.prismaService.users.findUnique({ where: { id }, include: { parent: true } });
  }

  async updateUser(id: string, data: UserUpdateDto): Promise<Users | null> {
    var user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestException(
        `${ReturnMessage.NOT_FOUND} ผู้ใช้ที่ต้องการแก้ไข`,
      );
    }

    return this.prismaService.users.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<Users | null> {
    var user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestException(
        `${ReturnMessage.NOT_FOUND} ผู้ใช้ที่ต้องการลบ`,
      );
    }
    return this.prismaService.users.delete({ where: { id } });
  }

  async getUserByUsername(username: string): Promise<Users | null> {
    return this.prismaService.users.findUnique({ where: { username } });
  }

  async getHashPassword(password: string): Promise<string> {
    const saltRound = parseInt(process.env.SALT_ROUNDS ?? '10', 10);
    return await bcrypt.hash(password, saltRound);
  }

  async getUsers(
    query: UserFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    try {
      const { page = 1, limit = 10, fullname, username, role } = query;

      const skip = (page - 1) * limit;

      const where: any = {
        ...(username && {
          username: { contains: username, mode: 'insensitive' },
        }),
        ...(role && { role }),
      };

      if (fullname) {
        where.AND = [
          {
            OR: [
              { firstName: { contains: fullname, mode: 'insensitive' } },
              { lastName: { contains: fullname, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where,
          skip,
          take: +limit,
          orderBy: { firstName: 'asc' },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        }),
        this.prismaService.users.count({ where }),
      ]);

      return paginateResponse(data, total, +page, +limit);
    } catch (error) {
      throw new BadRequestException(
        `${ReturnMessage.ERROR} ในการดึงข้อมูลผู้ใช้: ${error.message}`,
      );
    }
  }
}
