import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { GuardName } from '../enums/guard_name.enum';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieName } from '../enums/cookie_name.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  GuardName.JWTRefresh,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.[CookieName.Refresh],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.[CookieName.Refresh];
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
    return this.authService.verifyUserRefreshToken(refreshToken, payload.email);
  }
}
