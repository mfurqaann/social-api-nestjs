import { IsNotEmpty } from "class-validator";

export class DeletePostDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    authorId: number;
}