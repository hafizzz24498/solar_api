import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(join('.', 'key.pub'), 'utf8'),
    });
  }

  async validate(payload: any, done: VerifiedCallback): Promise<any> {
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(
      null,
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      payload.iat,
    );
  }
}
