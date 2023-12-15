import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ required: true })
    phone: string;

    @ApiProperty({ required: true })
    password: string;
} 