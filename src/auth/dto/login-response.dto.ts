export class LoginResponseDto {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
    token: string;
}