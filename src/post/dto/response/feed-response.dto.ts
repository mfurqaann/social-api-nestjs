import { ApiProperty } from "@nestjs/swagger";

export class FeedResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID feed'
  })
  id: number;

  @ApiProperty({
    example: 'Main futsal hari ini',
    description: 'Judul feed'
  })
  title: string;

  @ApiProperty({
    example: 'Main futsal hari ini bersama teman-teman kantor',
    description: 'Isi konten feed',
    nullable: true
  })
  content: string | null;

  @ApiProperty({
    example: true,
    description: 'Status publikasi feed',
    nullable: true
  })
  published: boolean | null;

  @ApiProperty({
    example: 10,
    description: 'ID author pembuat feed',
    nullable: true
  })
  authorId: number | null;
}
