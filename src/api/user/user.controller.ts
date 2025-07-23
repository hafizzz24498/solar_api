import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { Users } from 'generated/prisma';
import { UserFilterDto } from './dto/user-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';
import { ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/user-update.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<Users> {
    return this.userService.createUser(userCreateDto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<Users | null> {
    return this.userService.getUserById(id);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query() filter: UserFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    return this.userService.getUsers(filter);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<Users | null> {
    return this.userService.updateUser(id, userUpdateDto);
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<Users | null> {
    return this.userService.deleteUser(id);
  }
}
