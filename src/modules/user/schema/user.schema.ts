import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { Role } from '../enum/roles.enum';

export type UserDocument = HydratedDocument<User>;

class ImageSchema {
  @ApiPropertyOptional()
  utID: string;

  @ApiPropertyOptional()
  utURL: string;
}

@Schema()
export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty({ example: 'someone@email.com' })
  @Prop({ unique: true })
  email: string;

  @Prop({ required: false, default: false })
  isVerified: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  @ApiProperty({ example: 'someone' })
  @Prop()
  name?: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: false })
  hashedRefreshToken?: string;

  @ApiProperty({ example: Role.User })
  @Prop({ enum: Role, default: Role.User, required: false })
  role: string;

  @ApiPropertyOptional()
  @Prop({ type: Object, required: false })
  image?: ImageSchema;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

const userSchema = SchemaFactory.createForClass(User);
export { userSchema };
