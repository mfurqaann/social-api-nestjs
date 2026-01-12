import { IsEmail, IsEmpty, IsNotEmpty, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6)
    password: string;
}