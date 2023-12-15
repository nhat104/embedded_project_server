import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Home } from "src/home/schema/home.schema";
import { User } from "src/user/schema/user.schema";
import { StatusRequest } from "../enum/status-request.enum";

@Schema({ timestamps: true })
export class RequestMember {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    from: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    to: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true })
    home: Home;

    @Prop({ type: String, enum: StatusRequest, required: true, default: 'Pending' })
    status: string;
}

export type RequestMemberDocument = RequestMember & Document;
export const RequestMemberSchema = SchemaFactory.createForClass(RequestMember);