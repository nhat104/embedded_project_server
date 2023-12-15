import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { forwardRef } from '@nestjs/common/utils';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { HomeService } from 'src/home/home.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDocument } from './schema/room.schema';
import { RoomTypeDocument } from './schema/room-type.schema';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private roomModel: Model<RoomDocument>,
    @InjectModel('RoomType')
    private roomTypeModel: Model<RoomTypeDocument>,
    @Inject(forwardRef(() => HomeService))
    private homeService: HomeService,
    @Inject(forwardRef(() => DeviceService))
    private deviceService: DeviceService,
  ) {}

  async getAllRoomTypes() {
    const roomTypes = await this.roomTypeModel.find().select('name');
    return new ConfirmResponse({
      data: {
        success: true,
        roomTypes,
      },
    });
  }

  async createRoomType(data: CreateRoomTypeDto) {
    const { name } = data;
    const processedName = name.toLowerCase().replace(' ', '');
    const roomType = await this.roomTypeModel.findOne({ processedName });
    if (roomType) {
      throw new BadRequestException('Room type already existed');
    }
    await this.roomTypeModel.create({
      name,
      processedName,
    });
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async createRoom(id, data: CreateRoomDto) {
    const { type, home } = data;
    const existedHome = await this.homeService.getHomeByHomeId(home);
    if (!existedHome) {
      throw new BadRequestException('Home not existed');
    }
    if (existedHome?.members.findIndex((member) => member == id) == -1) {
      throw new ForbiddenException('Only member can create rooms');
    }
    const existedType = await this.roomTypeModel.findById(type);
    if (!existedType) {
      throw new BadRequestException('Type not existed');
    }
    await this.roomModel.create(data);
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async getRooms(homeId) {
    const rooms = this.roomModel.aggregate([
      {
        $match: {
          home: new mongoose.Types.ObjectId(homeId),
        },
      },
      {
        $lookup: {
          from: 'roomtypes',
          localField: 'type',
          foreignField: '_id',
          as: 'roomType',
        },
      },
      {
        $lookup: {
          from: 'devices',
          localField: '_id',
          foreignField: 'room',
          as: 'devices',
        },
      },
      {
        $project: {
          name: 1,
          roomType: { $first: '$roomType' },
          devicesNum: { $size: '$devices' },
        },
      },
      {
        $group: {
          _id: '$roomType._id',
          name: { $first: '$roomType.name' },
          rooms: { $push: '$$ROOT' },
        },
      },
    ]);
    return rooms;
  }

  async getRoomDetail(roomId) {
    const room = await this.roomModel
      .findById(roomId)
      .select('name type devices listDevices')
      .populate('type', 'name')
      .populate({
        path: 'devices',
        populate: {
          path: 'type',
          select: { name: 1 },
        },
        select: {
          name: 1,
          type: 1,
          control: 1,
        },
      });
    if (!room) {
      throw new NotFoundException('Room not existed');
    }
    return new ConfirmResponse({
      data: {
        success: true,
        room,
      },
    });
  }

  async deleteRoom(id, roomId) {
    const room = await this.roomModel
      .findById(roomId)
      .select('home')
      .populate('home', 'members');
    if (!room) {
      throw new BadRequestException('Room nor existed');
    }
    if (room.home.members.findIndex((member) => member == id) == -1) {
      throw new ForbiddenException('Only member can delete rooms');
    }
    await this.deviceService.deleteDevicesInRoom(roomId);
    await this.roomModel.findByIdAndDelete(roomId);
    return new ConfirmResponse({
      data: {
        success: true,
      },
    });
  }

  async getRoomById(id: string) {
    return await this.roomModel.findById(id);
  }

  async deleteRoomsInHome(home) {
    const rooms = await this.roomModel.find({ home });
    for (const room of rooms) {
      await this.deviceService.deleteDevicesInRoom(room.id);
    }
    await this.roomModel.deleteMany({ home });
  }

  async getRoomHomeById(id) {
    return await this.roomModel.findById(id).populate('home');
  }
}
