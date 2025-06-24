import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { hash, verify } from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { Role } from '../user/enum/roles.enum';
import { NODE_ENV_ENUM } from 'src/config/env_validation.config';
import { LoginDTO } from './dto/login.dto';
import { CookieName } from './enums/cookie_name.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDTO: LoginDTO, response: Response) {
    const user = await this.verifyUser(loginDTO.email, loginDTO.password);

    const expiresAccessToken = new Date(
      Date.now() +
        Number.parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_SEC) * 1000,
    );
    const expiresRefreshToken = new Date(
      Date.now() +
        Number.parseInt(process.env.REFRESH_TOKEN_EXPIRY_IN_SEC) * 1000,
    );

    const payload: TokenPayload = {
      userID: user._id,
      email: user.email,
      role: user.role as Role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_IN_SEC}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY_IN_SEC}s`,
    });

    await this.userService.findOneAndUpdateUser(
      { _id: user._id },
      { $set: { hashedRefreshToken: await hash(refreshToken) } },
    );

    response.cookie(CookieName.Authentication, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NODE_ENV_ENUM.PRODUCTION,
      expires: expiresAccessToken,
    });
    response.cookie(CookieName.Refresh, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NODE_ENV_ENUM.PRODUCTION,
      expires: expiresRefreshToken,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Successfully Logged In',
    };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });

      const isAuthenticated = await verify(user.hashedPassword, password);
      if (!isAuthenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
  }

  async verifyUserRefreshToken(refreshToken: string, email: string) {
    try {
      const user = await this.userService.getUser({ email });
      if (user.hashedRefreshToken) {
        const isAuthenticated = await verify(
          user.hashedRefreshToken,
          refreshToken,
        );
        if (!isAuthenticated) {
          throw new UnauthorizedException();
        }
        return user;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
