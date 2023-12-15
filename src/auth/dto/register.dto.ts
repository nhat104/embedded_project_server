import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ required: true })
    password: string;

    @ApiProperty({ required: true })
    rePassword: string;

} 