import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/room/schema/room.schema';

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceType',
    required: true,
  })
  type: Device;

  @Prop({
    type: [
      {
        message: { type: String },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
  })
  data: { message: string; createdAt: Date }[];

  @Prop({
    type: {
      status: {
        type: String,
        required: true,
        enum: ['ON', 'OFF'],
        default: 'OFF',
      },
      mode: { type: String, default: 'Auto' },
      value: { type: Number, default: 0 },
    },
    default: {
      status: 'OFF',
      mode: 'Auto',
      value: 0,
    },
  })
  control: { status: string; model: string; value: number };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  room: Room;
}

export type DeviceDocument = Device & Document;
export const DeviceSchema = SchemaFactory.createForClass(Device);
