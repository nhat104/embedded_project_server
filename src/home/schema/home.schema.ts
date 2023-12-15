import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schema/user.schema";

@Schema({ timestamps: true })
export class Home {
    @Prop({ required: true })
    name: string;

    @Prop()
    address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    host: User;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    members: User[];

}

export type HomeDocument = Home & Document;
export const HomeSchema = SchemaFactory.createForClass(Home);