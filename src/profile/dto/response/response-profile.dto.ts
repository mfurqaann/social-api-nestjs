import { Gender } from "src/generated/prisma/enums";

export class ProfileResponseDto {
  id: number | null;
  bio: string | null;
  photo: string | null;
  gender: Gender | null;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}
