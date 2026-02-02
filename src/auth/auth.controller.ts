import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/request/create-auth.dto';
import { LoginAuthDto } from './dto/request/login-auth.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('User registered successfully')
  register(@Body() createAuthDto: CreateAuthDto): Promise<RegisterResponseDto> {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ResponseMessage('User logged in successfully')
  @ApiOkResponse({
    description: 'User login',
    type: LoginResponseDto
  })
  login(@Body() loginAuthDto: LoginAuthDto, @Res({passthrough: true}) res: Response): Promise<LoginResponseDto> {
    return this.authService.login(loginAuthDto, res);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ResponseMessage('User logged out successfully')
  logout(@Res({passthrough: true}) res: Response) {
    return this.authService.logout(res);
  }
}
