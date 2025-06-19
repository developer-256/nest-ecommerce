import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ autoIndex: true, timestamps: true })
export class Task {
  @Prop()
  name: string;

  @Prop({ default: true })
  done: boolean;
}

const taskSchema = SchemaFactory.createForClass(Task);

export { taskSchema };
