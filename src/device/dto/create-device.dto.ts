import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  room: string;
}
