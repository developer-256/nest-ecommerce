import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const IsEmailTaken = await this.userModel.findOne({ email });
    if (IsEmailTaken) {
      throw new ConflictException('Email already taken');
    }

    return await this.userModel.create({
      name,
      email,
      hashedPassword: await hash(password),
    });
  }
}
