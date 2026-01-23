import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './request/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
