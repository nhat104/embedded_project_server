import { Controller, Post, Body, Patch, Req, UseGuards, UseInterceptors, BadRequestException, UploadedFile, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('profile')
  @ApiBody({ type: UpdateUserDto })
  @ApiTags('[USER] Update profile')
  async updateProfile(@Req() req, @Body() data: UpdateUserDto) {
    return await this.userService.updateProfile(req.user.id, data);
  }

  @Post('upload/avatar')
  @ApiTags('[USER] Upload avatar (note: use field avatar in body request)')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('File is not supported, only upload png, jpg, jpeg file'),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(req.user.id, file);
  }

  @Get('profile')
  @ApiTags('[USER] Get profile')
  async getProfile(@Req() req) {
    return await this.userService.getProfile(req.user.id);
  }
}
