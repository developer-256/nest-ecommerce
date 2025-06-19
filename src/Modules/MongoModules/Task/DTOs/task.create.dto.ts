import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  done: boolean;
}
