import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '../generated/prisma/client.js';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getPublishedPosts(): Promise<
    Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]
  > {
    return this.postService.getPublishedPost();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPostById(@Param('id') id: number, @Request() req): Promise<PostModel | null> {
    const userId = req.user?.id;
    return this.postService.post(Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filtered-posts/:searchString')
  getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createDraft(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ): Promise<PostModel> {
    const authorEmail = req.user?.email;
    return this.postService.createPost(createPostDto, authorEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Put('publish/:id')
  publishPost(@Param('id') id: string, @Request() req): Promise<PostModel> {
    const userId = req.user?.id;
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
      userId: Number(userId),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('unpublish/:id')
  unPublishPost(@Param('id') id: string, @Request() req): Promise<PostModel> {
    const userId = req.user?.id;
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: false },
      userId: Number(userId),
    });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(@Param('id') id: string, @Request() req): Promise<PostModel> {
    const userId = req.user?.id;
    return this.postService.deletePost({
      id: Number(id),
      authorId: Number(userId),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts(
    @Request() req,
  ): Promise<Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]> {
    const userId = req.user?.id;
    return this.postService.posts({
      where: { authorId: Number(userId) },
    });
  }
}
