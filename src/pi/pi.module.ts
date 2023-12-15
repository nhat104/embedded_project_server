import { Module } from '@nestjs/common';
import { MqttService } from './pi.service';

@Module({
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
