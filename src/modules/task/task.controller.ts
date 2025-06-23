import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/task.create.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Task } from './schema/task.schema';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiCreatedResponse({
    description: 'New Task created',
    type: Task,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Something went wrong',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @Post()
  async create(@Body() createTaskDTO: CreateTaskDTO) {
    return await this.taskService.create(createTaskDTO);
  }

  @ApiOperation({ summary: 'Get All Tasks' })
  @ApiCreatedResponse({
    description: 'All Tasks',
    type: [Task],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Something went wrong',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @Get()
  async getAll() {
    return await this.taskService.getAll();
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task _id' })
  @ApiCreatedResponse({
    description: 'New Task created',
    type: Task,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity Error',
    schema: {
      example: {
        message: 'Enter a valid ID',
        error: 'Unprocessable Entity Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found Error',
    schema: {
      example: {
        message: 'Task Not found',
        error: 'Not Found Error',
        statusCode: HttpStatus.NOT_FOUND,
      },
    },
  })
  @Get('/:id')
  async getByID(@Param('id') id: string) {
    return await this.taskService.getByID(id);
  }

  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiParam({ name: 'id', description: 'Task _id' })
  @ApiCreatedResponse({
    description: 'Delete Task',
    schema: {
      example: {
        message: 'Task Deleted Successfully',
        success: true,
        statusCode: HttpStatus.OK,
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity Error',
    schema: {
      example: {
        message: 'Enter a valid ID',
        error: 'Unprocessable Entity Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found Error',
    schema: {
      example: {
        message: 'Task Not found',
        error: 'Not Found Error',
        statusCode: HttpStatus.NOT_FOUND,
      },
    },
  })
  @Delete('/:id')
  async deleteByID(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiOkResponse({
    description: 'Task updated',
    type: Task,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity Error',
    schema: {
      example: {
        message: 'Enter a valid ID',
        error: 'Unprocessable Entity Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found Error',
    schema: {
      example: {
        message: 'Task Not found',
        error: 'Not Found Error',
        statusCode: HttpStatus.NOT_FOUND,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Something went wrong',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @Patch('/:id')
  async updateByID(
    @Param('id') id: string,
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    return await this.taskService.patch(id, createTaskDTO);
  }
}
