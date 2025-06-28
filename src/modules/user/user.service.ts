import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, verificationToken } = createUserDto;
    return this.userModel.create({
      name,
      email,
      verificationToken,
      hashedPassword: await hash(password),
    });
  }

  async getUser(query: FilterQuery<User>) {
    return this.userModel.findOne(query);
  }

  async findOneAndUpdateUser(
    query: FilterQuery<User>,
    mutation: UpdateQuery<User>,
  ) {
    const user = (
      await this.userModel.findOneAndUpdate(query, mutation)
    )?.toObject();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
