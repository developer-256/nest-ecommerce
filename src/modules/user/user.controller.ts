import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './schema/user.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JWTAuthGuard)
  @Get()
  async getUser(@CurrentUser() user: User) {
    const userResponse = (
      await this.userService.getUser({ email: user.email })
    )?.toObject();
    if (!userResponse) {
      throw new BadRequestException('User Not Found');
    }

    return {
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };
  }
}
