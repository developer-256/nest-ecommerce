import { IsNotEmpty } from 'class-validator';

export class CreateMailDto {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;
}
