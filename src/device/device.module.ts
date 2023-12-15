import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceTypeSchema } from './schema/device-type.schema';
import { DeviceSchema } from './schema/device.schema';
import { RoomModule } from 'src/room/room.module';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { forwardRef } from '@nestjs/common/utils';
import { SocketService } from 'src/socket/socket.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MqttModule,
    forwardRef(() => RoomModule),
    forwardRef(() => NotificationModule),
    MongooseModule.forFeature([
      { name: 'DeviceType', schema: DeviceTypeSchema },
      { name: 'Device', schema: DeviceSchema },
    ]),
  ],
  providers: [DeviceService, SocketService],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
