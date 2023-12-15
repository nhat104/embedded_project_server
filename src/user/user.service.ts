import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>
  ) { }

  async createUser(user) {
    return await this.userModel.create(user);
  }

  async getUserByPhone(phone: string) {
    const user = await this.userModel.findOne({ phone });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async updateUser(id, data) {
    const user = await this.userModel.findOneAndUpdate({ id: id }, data);
    return user
  }

  async getUserHome(id) {
    const user: any = await this.userModel.findById(id)
      .populate({
        path: 'homes',
        select: { 'name': 1, 'address': 1, 'members': 1, 'host': 1 },
        populate: {
          path: 'members',
          select: { 'name': 1, 'phone': 1 }
        }
      })
      .lean();
    const homes = user?.homes;
    homes.forEach(home => {
      if (home.host == id) {
        home.isHost = true;
      } else {
        home.isHost = false;
      }
    })
    return homes;
  }

  async updateProfile(id: string, data: UpdateUserDto) {
    const { phone } = data;
    if (phone) {
      const user = await this.getUserByPhone(phone);
      if (user) {
        throw new ConflictException('User with this phone already existed');
      }
    }
    await this.userModel.findByIdAndUpdate(id, data);
    return new ConfirmResponse({
      data: {
        success: true,
      }
    })
  }

  async updateAvatar(id, file) {
    if (!file) {
      throw new BadRequestException('Empty file avatar');
    }
    const avatar = file.path.split('\\').join('/');
    await this.userModel.findByIdAndUpdate(id, { avatar: avatar });
    return new ConfirmResponse({
      data: {
        success: true,
        avatar: avatar,
      },
    });
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select('name phone email avatar');
    return new ConfirmResponse({
      data: {
        success: true,
        user,
      }
    })
  }
}
