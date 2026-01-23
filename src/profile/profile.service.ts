import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {

  constructor(private prismaService: PrismaService) {}

  async findByUserId(id: number) {
    const findUser = await this.prismaService.profile.findUnique({
      where: {
        userId: id
      },
      include: {
        user: true
      }
    })

    if (!findUser) {
      throw new NotFoundException('User is not found')
    }
    return findUser;
  }

  create(createProfileDto: CreateProfileDto, userId: number) {
    return this.prismaService.profile.create({
      data: { ...createProfileDto, userId },
    });
  }
}
