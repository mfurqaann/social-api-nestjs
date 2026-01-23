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
import { CreatePostDto } from './dto/request/create-post.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtUser } from 'src/common/interfaces/jwt-user.interface';
import { FeedResponseDto } from './dto/response/feed-response.dto';
import { GetPostsResponseDto } from './dto/response/get-posts-response.dto';
import { CreatePostResponseDto } from './dto/response/create-post-response.dto';
import { UpdatePostResponseDto } from './dto/response/update-post-response.dto';
import { GetFilterPostResponseDto } from './dto/response/get-filter-post-response.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getPublishedPosts(): Promise<
    FeedResponseDto[]
  > {
    return this.postService.getPublishedPost();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPostById(
    @Param('id') id: number,
    @CurrentUser() user: JwtUser,
  ): Promise<GetPostsResponseDto> {
    const userId = user?.id;
    return this.postService.post(Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filtered-posts/:searchString')
  getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<GetFilterPostResponseDto[]> {
    return this.postService.getFilteredPost(searchString);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createDraft(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: JwtUser,
  ): Promise<CreatePostResponseDto> {
    const authorEmail = user?.email;
    return this.postService.createPost(createPostDto, authorEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Put('publish/:id')
  publishPost(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<UpdatePostResponseDto> {
    const userId = user?.id;
    return this.postService.updatePost(Number(id), true, Number(userId))
  }

  @UseGuards(JwtAuthGuard)
  @Put('unpublish/:id')
  unPublishPost(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<UpdatePostResponseDto> {
    const userId = user?.id;
    return this.postService.updatePost(Number(id), false, Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<void> {
    const userId = user?.id;
    return this.postService.deletePost({
      id: Number(id),
      authorId: Number(userId),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts(
    @CurrentUser() user: JwtUser,
  ): Promise<GetPostsResponseDto[]> {
    const userId = user?.id;
    const where = { authorId: Number(userId) };
    return this.postService.posts({
      where,
    });
  }
}
