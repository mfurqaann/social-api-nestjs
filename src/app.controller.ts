import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { PostService } from './post.service.js';
import { User as UserModel } from './generated/prisma/client.js';
import { Post as PostModel } from './generated/prisma/client.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';

@Controller()
export class AppController {
  constructor(
    private readonly UserService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return this.postService.post({ id: Number(id) });
  }
  
  @Get('feed')
  async getPublishedPosts(): Promise<Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
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
  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string },
    @Req() req
  ): Promise<PostModel> {
    const authorEmail = req.user?.email;
    const { title, content} = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Get('post')
  async getAllPosts(@Request() req): Promise<Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]> {
    const {id} = req.user
    return this.postService.posts({
      where: { authorId: Number(id) },
    });
  }
}
