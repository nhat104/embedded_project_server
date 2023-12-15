import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('User with this phone does not exist');
    }
    const isPassWordMatched = await bcrypt.compare(password, user.password);
    if (!isPassWordMatched) {
      throw new UnauthorizedException('Incorrect password ');
    }
    user.password = undefined;
    return user;
  }

  async register(data): Promise<ConfirmResponse> {
    const { phone, password, rePassword } = data;
    const user = await this.usersService.getUserByPhone(phone);
    if (user) {
      throw new ConflictException('User with this phone already existed');
    }
    if (password !== rePassword) {
      throw new BadRequestException('Password and confirm password not match');
    }
    data.password = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser(data);
    newUser.password = undefined;
    return new ConfirmResponse({
      data: {
        success: true,
        user: newUser,
      },
    });
  }

  async login(user: any): Promise<ConfirmResponse> {
    const payload = { id: user._id, roles: user.roles };
    return new ConfirmResponse({
      data: {
        success: true,
        token: this.jwtService.sign(payload),
        id: user._id,
      },
    });
  }
}
