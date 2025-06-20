import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTaskDTO {
  @ApiProperty({ description: 'Add task name', example: 'Do some coding' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Is task done', example: true })
  @IsNotEmpty()
  @IsBoolean()
  done: boolean;
}
