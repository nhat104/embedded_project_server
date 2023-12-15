import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { DeviceService } from './device.service';
import { ControlDeviceDto } from './dto/control-device.dto';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
@Controller('api/devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('device-types')
  @ApiTags('[DEVICE] Get all device types')
  async getAllDeviceTypes() {
    return await this.deviceService.getAllDeviceTypes();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('device-types')
  @ApiBody({ type: CreateDeviceTypeDto })
  @ApiTags('[DEVICE] Create a new device type')
  async createRoomType(@Body() data: CreateDeviceTypeDto) {
    return await this.deviceService.createDeviceType(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateDeviceDto })
  @ApiTags('[DEVICE] Create a new device')
  async createDevice(@Body() data: CreateDeviceDto) {
    return await this.deviceService.createDevice(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiTags('[DEVICE] Get device detail')
  async getDeviceDetail(@Param('id') id: string) {
    return await this.deviceService.getDevice(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiTags('[DEVICE] Delete a device')
  async deleteDevice(@Param('id') id: string) {
    return await this.deviceService.deleteDevice(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/control')
  @ApiTags('[DEVICE] Control device')
  @ApiBody({ type: ControlDeviceDto })
  async controlDevice(@Param('id') id: string, @Body() data: ControlDeviceDto) {
    return await this.deviceService.controlDevice(id, data);
  }

  @MessagePattern('iot/group8/data', { qos: 2 })
  async getData(@Payload() data) {
    console.log(data);
    await this.deviceService.getData(data);
  }
}
