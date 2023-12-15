import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Device } from "src/device/schema/device.schema";
import { User } from "src/user/schema/user.schema";
import { TypeNotification } from "../enum/type-notification.enum";


@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Device' })
    device: Device;

    @Prop({ type: String, enum: TypeNotification, required: true })
    type: string;

    @Prop({ type: Boolean, required: true, default: false })
    isRead: boolean;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);