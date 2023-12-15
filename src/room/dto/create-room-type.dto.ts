import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRoomTypeDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    name: string;
}