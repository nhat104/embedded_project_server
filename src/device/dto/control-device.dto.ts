import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class ControlDeviceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['ON', 'OFF'])
  status: string;

  @ApiProperty({ required: false })
  mode: number;

  @ApiProperty({ required: false })
  value: number;
}
