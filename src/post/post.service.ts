import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DeletePostDto } from './dto/delete-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from 'src/generated/prisma/models';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(id: number, userId: number): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {id},
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
  }): Promise<Pick<Post, 'id' | 'title' | 'content' | 'published'>[]> {
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

  async createPost(createPostDto: CreatePostDto, authorEmail: string): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        author: {
          connect: { email: authorEmail },
        }
      },
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
    userId?: number;
  }): Promise<Post> {
     const { data, where, userId } = params;
    const post = await this.prisma.post.findUnique({
      where
    })
    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this post');
    }

    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(dto: DeletePostDto): Promise<Post> {
    const { id, authorId } = dto;

    const post = await this.prisma.post.findUnique({
      where: {id}
    })

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== authorId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return this.prisma.post.delete({
      where: {id}
    });
  }

  getPublishedPost(): Promise<Pick<PostModel, 'id' | 'title' | 'content' | 'published'>[]> {
    return this.prisma.post.findMany({
      where: { published: true },
    })
  }
}
