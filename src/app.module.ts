import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { MqttModule } from './mqtt/mqtt.module';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';
import { RequestMemberModule } from './request-member/request-member.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from './cron-job/cron-job.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    HomeModule,
    RoomModule,
    DeviceModule,
    MqttModule,
    NotificationModule,
    RequestMemberModule,
    ScheduleModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
