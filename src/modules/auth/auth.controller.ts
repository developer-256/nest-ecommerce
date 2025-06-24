import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { CookieName } from './enums/cookie_name.enum';
import { JWTRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCookieAuth(CookieName.Refresh)
  @ApiCookieAuth(CookieName.Authentication)
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDTO, response);
  }

  @ApiCookieAuth(CookieName.Refresh)
  @ApiCookieAuth(CookieName.Authentication)
  @Post('refresh')
  @UseGuards(JWTRefreshAuthGuard)
  async refresh(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDTO, response);
  }
}
