import { Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/notifications')
export class NotificationController {
    constructor(
        private notificationService: NotificationService
    ) { }
    @Get()
    @ApiTags('[NOTIFICATION] Get all my notifications')
    async getNotifications(@Req() req, @Query() query: GetNotificationsDto) {
        return await this.notificationService.getNotifications(req.user.id, query);
    }

    @Patch(':id/read')
    @ApiTags('[NOTIFICATION] Read notification')
    async readNotification(@Req() req, @Param('id') id: string) {
        return await this.notificationService.readNotification(req.user.id, id)
    }

    @Patch('read-all')
    @ApiTags('[NOTIFICATION] Read all notifications')
    async readAll(@Req() req) {
        return await this.notificationService.readAll(req.user.id);
    }
}
