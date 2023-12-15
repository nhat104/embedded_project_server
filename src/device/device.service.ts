import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { MqttService } from 'src/mqtt/mqtt.service';
import { RoomService } from 'src/room/room.service';
import { ControlDeviceDto } from './dto/control-device.dto';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDocument } from './schema/device.schema';
import { DeviceTypeDocument } from './schema/device-type.schema';
import { forwardRef } from '@nestjs/common/utils';
import { SocketService } from 'src/socket/socket.service';
import { NotificationService } from 'src/notification/notification.service';
import { TypeNotification } from 'src/notification/enum/type-notification.enum';
// import { Gpio } from 'onoff';
// const LEDPin = new Gpio(23, 'out');

const devices = [
  {
    id: '63bb48c053ed6bd2b528c623',
    pin: 1,
  },
  {
    id: '63d4f6d46651091cd3fcf132',
    pin: 2,
  },
];

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel('DeviceType')
    private deviceTypeModel: Model<DeviceTypeDocument>,
    @InjectModel('Device')
    private deviceModel: Model<DeviceDocument>,
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private mqttService: MqttService,
    private socketService: SocketService,
  ) {}
  async createDevice(data: CreateDeviceDto) {
    const { type, room } = data;
    const existedRoom = await this.roomService.getRoomById(room);
    if (!existedRoom) {
      throw new BadRequestException('Room not existed');
    }
    const deviceType = await this.deviceTypeModel.findById(type);
    if (!deviceType) {
      throw new BadRequestException('Device type not existed');
    }

    const device = await this.deviceModel.create(data);
    return new ConfirmResponse({
      data: {
        success: true,
        device,
      },
    });
  }

  async getDevice(id: string) {
    const device = await this.deviceModel.findById(id).populate('type', 'name');
    return new ConfirmResponse({
      data: {
        success: true,
        device,
      },
    });
  }

  async deleteDevice(id) {
    const device = await this.deviceModel.findById(id);
    if (!device) {
      throw new BadRequestException('Device not existed');
    }
    await this.deviceModel.findByIdAndDelete(id);
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async getAllDeviceTypes() {
    const deviceTypes = await this.deviceTypeModel.find().select('name');
    return new ConfirmResponse({
      data: {
        success: true,
        deviceTypes,
      },
    });
  }

  async createDeviceType(data: CreateDeviceTypeDto) {
    const { name } = data;
    const processedName = name.toLowerCase().replace(' ', '');
    const deviceType = await this.deviceTypeModel.findOne({ processedName });
    if (deviceType) {
      throw new BadRequestException('Device type already existed');
    }
    await this.deviceTypeModel.create({
      name,
      processedName,
    });
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async controlDevice(id, data: ControlDeviceDto) {
    const device = await this.deviceModel.findById(id);
    if (!device) {
      throw new BadRequestException('Device not existed');
    }
    // console.log({ ...device.control._doc, ...data });
    // await device.save();
    await this.deviceModel.findByIdAndUpdate(id, { control: data });

    // LEDPin.writeSync(data.status == 'ON' ? 1 : 0); //turn LED on or off

    // this.mqttService.publish(
    //   process.env.MQTT_TOPIC_CONTROL,
    //   JSON.stringify({ control: data, deviceId: id }),
    // );
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async getData(payload) {
    const { message, control, type, deviceId } = payload;
    const device = await this.deviceModel.findById(deviceId);
    const room = await this.roomService.getRoomHomeById(device.room);
    if (device && room) {
      if (message) {
        for (const member of room.home.members) {
          const notificationData = {
            content: `${message} from device ${device.name} in ${room.name} room of ${room.home.name} home`,
            type: type || TypeNotification.WARNING,
            device: deviceId,
            user: member,
          };
          await this.notificationService.createNotification(notificationData);
          await this.socketService.sendNotification(
            member.toString(),
            notificationData,
          );
        }
      }

      if (control) {
        device.control = control;
        await device.save();
        for (const member of room.home.members) {
          await this.socketService.sendControl(member.toString(), {
            control,
            deviceId,
          });
        }
      }
    }
  }

  async deleteDevicesInRoom(room) {
    await this.deviceModel.deleteMany({ room });
  }
}
