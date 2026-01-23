export class UpdatePostResponseDto {
    id: number;
    title: string;
    content: string | null;
    published: boolean | null;
    authorId: number | null;
}