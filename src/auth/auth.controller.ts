import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto): Promise<RegisterResponseDto> {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<LoginResponseDto> {
    return this.authService.login(loginAuthDto);
  }
}
