import { Gender } from "src/generated/prisma/enums";

export class CreateProfileResponseDto {
    id: number;
    userId: number | null;
    bio: string | null;
    photo: string | null;;
    gender: Gender | null;
}