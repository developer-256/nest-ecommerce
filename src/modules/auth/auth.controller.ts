import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

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
      throw new BadRequestException('Token Required. Signup again');
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

  @ApiOperation({ summary: 'Logout' })
  @Get('Logout')
  @UseGuards(JWTAuthGuard)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @ApiCookieAuth(CookieName.Refresh)
  @ApiCookieAuth(CookieName.Authentication)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @Post('refresh')
  @UseGuards(JWTRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.generateTokens(user, response);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Tokens Refreshed Successfully',
    };
  }
}
