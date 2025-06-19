import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './Modules/MongoModules/Task/task.controller';
import { TaskService } from './Modules/MongoModules/Task/task.service';
import { Task, taskSchema } from './DB/Models/MongoEntities/task.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/new_nest'),
    MongooseModule.forFeature([{ name: Task.name, schema: taskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
