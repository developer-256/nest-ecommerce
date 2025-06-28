import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { hash, verify } from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { Role } from '../user/enum/roles.enum';
import { NODE_ENV_ENUM } from 'src/config/env_validation.config';
import { LoginDTO } from './dto/login.dto';
import { CookieName } from './enums/cookie_name.enum';
import { SignupDto } from './dto/signup.dto';
import { MailService } from '../other/mailer/mail.service';
import { verificationEmail } from 'src/common/template/verification_email.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async signup(signupDto: SignupDto) {
    const isAlreadyUser = await this.userService.getUser({
      email: signupDto.email,
    });

    const newVerificationToken = this.jwtService.sign(
      { email: signupDto.email },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: `15m`,
      },
    );

    if (!isAlreadyUser) {
      try {
        const createdUser = await this.userService.createUser({
          email: signupDto.email,
          password: signupDto.password,
          name: signupDto.name,
          verificationToken: await hash(newVerificationToken),
        });

        this.mailService.sendMail({
          from: 'Ecommerce Backend',
          to: createdUser.email,
          subject: 'Verify Your Email',
          body: verificationEmail(
            `http://localhost:8085/verify?token=${newVerificationToken}`,
          ),
        });

        return {
          success: true,
          status: HttpStatus.OK,
          message: 'Check You Email. (Check Spam folder too)',
        };
      } catch (error) {
        console.log(error);

        throw new InternalServerErrorException('Something went wrong');
      }
    }

    if (isAlreadyUser && isAlreadyUser.isVerified) {
      throw new BadRequestException(
        'You already have an account. Signin Instead',
      );
    }

    try {
      isAlreadyUser.verificationToken = await hash(newVerificationToken);
      isAlreadyUser.name = signupDto.name;
      isAlreadyUser.hashedPassword = await hash(signupDto.password);
      await isAlreadyUser.save();

      this.mailService.sendMail({
        from: 'Ecommerce Backend',
        to: isAlreadyUser.email,
        subject: 'Verify Your Email',
        body: verificationEmail(
          `http://localhost:8085/verify?token=${newVerificationToken}`,
        ),
      });

      return {
        success: true,
        status: HttpStatus.OK,
        message: 'Check You Email. (Check Spam folder too)',
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async verifyEmail(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    if (!decoded.email) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = await this.userService.getUser({ email: decoded.email });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    if (user.isVerified) {
      throw new BadRequestException('Your email is already verified');
    }

    try {
      user.verificationToken = '';
      user.isVerified = true;
      await user.save();

      return {
        success: true,
        status: HttpStatus.OK,
        message: 'Email Successfully Verified. You can now Login',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something Went Wrong');
    }
  }

  async login(loginDTO: LoginDTO, response: Response) {
    const user = await this.verifyUser(loginDTO.email, loginDTO.password);
    if (!user.isVerified) {
      throw new UnauthorizedException('Your email is not verified');
    }

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
      const user = (await this.userService.getUser({ email }))?.toObject();
      if (!user) {
        throw new Error('User Not Found');
      }

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
      const user = (await this.userService.getUser({ email }))?.toObject();
      if (!user) {
        throw new Error('User Not Found');
      }

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
