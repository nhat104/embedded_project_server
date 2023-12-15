import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Device } from 'src/device/schema/device.schema';
import { Home } from 'src/home/schema/home.schema';
import { RoomType } from './room-type.schema';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true,
  })
  type: RoomType;

  // @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Device' })
  // devices: Device[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true })
  home: Home;
}

export type RoomDocument = Room & Document;
const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.virtual('devices', {
  ref: 'Device',
  foreignField: 'room',
  localField: '_id',
});
export { RoomSchema };
