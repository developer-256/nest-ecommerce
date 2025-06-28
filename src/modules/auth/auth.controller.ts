import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { CookieName } from './enums/cookie_name.enum';
import { JWTRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Signup' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Verify Email Address' })
  @Post('verify')
  async verify(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token Required');
    }

    return await this.authService.verifyEmail(token);
  }

  @ApiCookieAuth(CookieName.Refresh)
  @ApiCookieAuth(CookieName.Authentication)
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDTO, response);
  }

  @ApiCookieAuth(CookieName.Refresh)
  @ApiCookieAuth(CookieName.Authentication)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @Post('refresh')
  @UseGuards(JWTRefreshAuthGuard)
  async refresh(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDTO, response);
  }
}
