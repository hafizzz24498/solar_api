import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { paginateResponse } from 'src/shared/paginate-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { jwtDecorator } from 'src/shared/jwt.decorator';
import { ReturnMessage } from 'src/shared/enum/return-message.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<UserDto> {
    const user = await this.userService.createUser(userCreateDto);
    return plainToInstance(UserDto, user);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@jwtDecorator() user: any): Promise<UserDto | null> {
    try {
      const userData = await this.userService.getUserById(user.id);
      if (!userData) {
        throw new NotFoundException(ReturnMessage.NOT_FOUND);
      }

      return plainToInstance(UserDto, userData);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<UserDto | null> {
    const user = await this.userService.getUserById(id);
    return plainToInstance(UserDto, user);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query() filter: UserFilterDto,
  ): Promise<ReturnType<typeof paginateResponse>> {
    const users = await this.userService.getUsers(filter);
    console.log('Users:', users);
    return users;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserDto | null> {
    const user = await this.userService.updateUser(id, userUpdateDto);
    return plainToInstance(UserDto, user);
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<UserDto | null> {
    const user = await this.userService.deleteUser(id);
    return plainToInstance(UserDto, user);
  }
}

