import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { UserService } from 'src/modules/user/user.service';
import { GuardName } from '../enums/guard_name.enum';
import { Request } from 'express';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CookieName } from '../enums/cookie_name.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, GuardName.JWT) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.[CookieName.Authentication],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    const user = (
      await this.userService.getUser({ email: payload.email })
    )?.toObject();
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Your email is not verified. Signup again',
      );
    }

    return user;
  }
}
