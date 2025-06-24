import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './schema/user.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @todo change below route with signup route
   */
  @Post()
  async createUser(@Body() createUserDTO: CreateUserDto) {
    return await this.userService.createUser(createUserDTO);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async getUser(@CurrentUser() user: User) {
    const userResponse = await this.userService.getUser({ email: user.email });
    const { hashedPassword, hashedRefreshToken, ...safeUser } = userResponse;
    return safeUser;
  }
}
