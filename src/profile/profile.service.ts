import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProfileDto } from './dto/request/create-profile.dto';
import { PrismaService } from 'src/prisma.service';
import { ProfileResponseDto } from './dto/response/response-profile.dto';
import { CreateProfileResponseDto } from './dto/response/create-profile-response.dto';

@Injectable()
export class ProfileService {

  constructor(private prismaService: PrismaService) {}

  async findByUserId(userId: number): Promise<ProfileResponseDto> {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      include: {
        profile: true
      }
    })

    if (!findUser) {
      throw new UnauthorizedException()
    }
    
    return {
    id: findUser.profile?.id ?? null,
    bio: findUser.profile?.bio ?? null,
    photo: findUser.profile?.photo ?? null,
    gender: findUser.profile?.gender ?? null,
      user: {
        id: findUser.id,
        email: findUser.email,
        name: findUser.name,
      },
  };
  }

  create(createProfileDto: CreateProfileDto, userId: number): Promise<CreateProfileResponseDto> {
    return this.prismaService.profile.create({
      data: { ...createProfileDto, userId },
      omit: {
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
