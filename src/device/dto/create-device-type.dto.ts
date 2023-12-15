import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDeviceTypeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
}
