import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTOs/task.create.dto';

@Controller('/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDTO: CreateTaskDTO) {
    return await this.taskService.create(createTaskDTO);
  }

  @Get()
  async getAll() {
    return await this.taskService.getAll();
  }

  @Get('/:id')
  async getByID(@Param('id') id: string) {
    return await this.taskService.getByID(id);
  }

  @Delete('/:id')
  async deleteByID(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }

  @Patch('/:id')
  async updateByID(
    @Param('id') id: string,
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    return await this.taskService.patch(id, createTaskDTO);
  }
}
