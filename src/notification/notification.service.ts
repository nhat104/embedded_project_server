import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { NotificationDocument } from './schema/notification.schema';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel('Notification')
        private notificationModel: Model<NotificationDocument>
    ) { }

    async getNotifications(id, data) {
        const { pageSize = 10, pageNumber = 1, isRead } = data;
        const findOption = (isRead != null || isRead != undefined) ? { user: id, isRead: isRead } : { user: id };
        const notifications = await this.notificationModel.find(findOption).skip(pageSize * (pageNumber - 1)).limit(pageSize).sort({ 'createdAt': -1 });
        const total = await this.notificationModel.count(findOption);
        return new ConfirmResponse({
            data: {
                success: true,
                notifications,
                total,
            }
        })
    }

    async readAll(id) {
        await this.notificationModel.updateMany({ user: id, isRead: false }, { $set: { isRead: true } });
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async readNotification(userId, id) {
        const notification = await this.notificationModel.findOne({ id: id, user: userId, isRead: false });
        if (!notification) {
            throw new BadRequestException('Can not mark notification as read');
        }
        notification.isRead = true;
        await notification.save();
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async createNotification(data) {
        return await this.notificationModel.create(data);
    }
}
