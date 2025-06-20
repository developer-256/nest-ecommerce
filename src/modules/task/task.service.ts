import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './entity/task.entity';
import { CreateTaskDTO } from './dto/task.create.dto';
import { UpdateTaskDTO } from './dto/task.update.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDTO: CreateTaskDTO) {
    const task = await this.taskModel.create(createTaskDTO);
    if (!task) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return task;
  }

  async getAll() {
    const task = await this.taskModel.find();
    if (!task) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return task;
  }

  async getByID(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException('Invalid ID format');
    }

    const task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }

    return task;
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException('Invalid ID format');
    }

    const deleted = await this.taskModel.deleteOne({ _id: id });
    if (deleted.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Task with id: ${id} deleted successfully`,
    };
  }

  async patch(id: string, updateTaskDTO: UpdateTaskDTO) {
    if (!Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException('Invalid ID format');
    }

    const updated = await this.taskModel.findByIdAndUpdate(id, updateTaskDTO, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }

    return updated;
  }
}
