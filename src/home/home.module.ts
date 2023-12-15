import { forwardRef, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeSchema } from './schema/home.schema';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';
import { RequestMemberModule } from 'src/request-member/request-member.module';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [
    UserModule,
    forwardRef(() => RoomModule),
    forwardRef(() => RequestMemberModule),
    MongooseModule.forFeature([{ name: 'Home', schema: HomeSchema }])
  ],
  providers: [HomeService, SocketService],
  controllers: [HomeController],
  exports: [HomeService],
})
export class HomeModule { }
