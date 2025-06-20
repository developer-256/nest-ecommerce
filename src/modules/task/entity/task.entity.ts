import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @ApiProperty()
  _id: string;

  @ApiProperty({ example: 'Do some coding' })
  @Prop()
  name: string;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  done: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

const taskSchema = SchemaFactory.createForClass(Task);

export { taskSchema };
