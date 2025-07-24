import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(
    input: LoginDto,
  ): Promise<{ data: UserDto; accessToken: string }> {
    const user = await this.userService.getUserByUsername(input.username);
    const isPasswordValid = await this.compareHashPassword(
      input.password,
      user?.password || '',
    );

    if (!user || !isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    const userReturn = plainToInstance(UserDto, user);
    return {
      data: userReturn,
      accessToken: this.jwtService.sign(user),
    };
  }

  async compareHashPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
