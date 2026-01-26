import { IsEnum, IsOptional, IsString } from "class-validator";
import { Gender } from "src/generated/prisma/enums";

export class CreateProfileDto {
    @IsString()
    @IsOptional()
    bio?: string;

    @IsOptional()
    @IsString()
    photo?: string;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender
}
