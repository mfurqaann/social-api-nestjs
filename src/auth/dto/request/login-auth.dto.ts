import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, MinLength } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({example: 'johndoe@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'password123'})
    @MinLength(6)
    password: string;
}