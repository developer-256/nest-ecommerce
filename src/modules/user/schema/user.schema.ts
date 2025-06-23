import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

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

  @ApiProperty({ example: 'someone' })
  @Prop()
  name?: string;

  @Prop({ required: true })
  hashedPassword: string;

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
