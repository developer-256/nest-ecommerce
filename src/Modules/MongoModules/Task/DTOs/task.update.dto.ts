import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDTO } from './task.create.dto';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}
