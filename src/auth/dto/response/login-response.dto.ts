import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'furqan@gmail.com'})
    email: string;

    @ApiProperty({example: 'Furqan'})
    name: string | null;
}