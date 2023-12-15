import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger/dist';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('api')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    @Post('register')
    @ApiBody({ type: RegisterDto })
    @ApiTags('[AUTH] Register')
    async register(@Body() user): Promise<ConfirmResponse> {
        return await this.authService.register(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDto })
    @ApiTags('[AUTH] Login')
    async login(@Req() req): Promise<ConfirmResponse> {
        return await this.authService.login(req.user);
    }
}
