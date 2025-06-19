import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data: T;

  constructor(status: HttpStatus, data: T) {
    this.statusCode = status;
    this.data = data;
  }
}
