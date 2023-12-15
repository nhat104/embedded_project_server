import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class RoomType {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  processedName: string;
}

export type RoomTypeDocument = RoomType & Document;
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
