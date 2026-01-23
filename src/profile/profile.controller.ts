import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtUser } from 'src/interfaces/jwt-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@CurrentUser() user: JwtUser) {
    const id = user.id
    return this.profileService.findByUserId(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @CurrentUser() user: JwtUser) {
    const userId = user.id
    return this.profileService.create(createProfileDto, Number(userId));
  }
}
