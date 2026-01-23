import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DeletePostDto } from './dto/request/delete-post.dto';
import { CreatePostDto } from './dto/request/create-post.dto';
import { PostModel } from 'src/generated/prisma/models';
import { FeedResponseDto } from './dto/response/feed-response.dto';
import { GetPostsResponseDto } from './dto/response/get-posts-response.dto';
import { CreatePostResponseDto } from './dto/response/create-post-response.dto';
import { UpdatePostResponseDto } from './dto/response/update-post-response.dto';
import { GetFilterPostResponseDto } from './dto/response/get-filter-post-response.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(id: number, userId: number): Promise<GetPostsResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: {id},
      omit: {
        createdAt: true,
        updatedAt: true
      }
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to access this post');
    }

    return post
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<GetPostsResponseDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
      }
    });
  }

  async createPost(createPostDto: CreatePostDto, authorEmail: string): Promise<CreatePostResponseDto> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        author: {
          connect: { email: authorEmail },
        }
      },
      omit: {
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async updatePost(id: number, published: boolean, userId: number): Promise<UpdatePostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id }
    })
    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: { published },
      omit: {
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deletePost(dto: DeletePostDto): Promise<void> {
    const { id, authorId } = dto;

    const post = await this.prisma.post.findUnique({
      where: {id}
    })

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== authorId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    this.prisma.post.delete({
      where: {id}
    });
  }

  async getPublishedPost(): Promise<FeedResponseDto[]> {
    const feed = await this.prisma.post.findMany({
      where: { published: true },
      omit: {
        createdAt: true,
        updatedAt: true
      }
    })

    return feed
  }

  getFilteredPost(searchString: string): Promise<GetFilterPostResponseDto[]> {
    return this.prisma.post.findMany({
      where: {
        OR: [
          {
            title: { contains: searchString, mode: 'insensitive'},
          },
          {
            content: { contains: searchString, mode: 'insensitive'},
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
      }
    })
  }
}
