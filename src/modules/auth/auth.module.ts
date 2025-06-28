import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWTRefreshStrategy } from './strategies/refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '../other/mailer/mail.service';
import { MailModule } from '../other/mailer/mail.module';

@Module({
  imports: [UserModule, PassportModule, JwtModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, JWTRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
