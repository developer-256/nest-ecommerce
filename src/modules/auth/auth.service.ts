import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { Role } from '../user/enum/roles.enum';
import { NODE_ENV_ENUM } from 'src/config/env_validation.config';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDTO: LoginDTO, response: Response) {
    const user = await this.verifyUser(loginDTO.email, loginDTO.password);

    const expiresInSec = Number.parseInt(
      process.env.ACCESS_TOKEN_EXPIRY_IN_SEC,
    );
    const expiresAccessToken = new Date(Date.now() + expiresInSec * 1000);

    const payload: TokenPayload = {
      userID: user._id,
      email: user.email,
      role: user.role as Role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_IN_SEC}s`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NODE_ENV_ENUM.PRODUCTION,
      expires: expiresAccessToken,
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
}
