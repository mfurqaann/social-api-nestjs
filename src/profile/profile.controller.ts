import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/request/create-profile.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtUser } from 'src/common/interfaces/jwt-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileResponseDto } from './dto/response/response-profile.dto';
import { CreateProfileResponseDto } from './dto/response/create-profile-response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@CurrentUser() user: JwtUser): Promise<ProfileResponseDto> {
    const id = user.id
    return this.profileService.findByUserId(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @CurrentUser() user: JwtUser): Promise<CreateProfileResponseDto> {
    const userId = user.id
    return this.profileService.create(createProfileDto, Number(userId));
  }
}
