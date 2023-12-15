import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class DeviceType {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  processedName: string;
}

export type DeviceTypeDocument = DeviceType & Document;
export const DeviceTypeSchema = SchemaFactory.createForClass(DeviceType);
