import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/request/create-auth.dto';
import { LoginAuthDto } from './dto/request/login-auth.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto): Promise<RegisterResponseDto> {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User login',
    type: LoginResponseDto
  })
  login(@Body() loginAuthDto: LoginAuthDto, @Res({passthrough: true}) res: Response): Promise<LoginResponseDto> {
    return this.authService.login(loginAuthDto, res);
  }
}
