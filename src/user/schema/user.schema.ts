import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Home } from "src/home/schema/home.schema";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, match: /^0[0-9]{9,10}$/ })
    phone: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: false })
    avatar: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Home' })
    homes: Home[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);