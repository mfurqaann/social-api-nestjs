import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}
  async register(createAuthDto: CreateAuthDto) {
    const {email, name, password} = createAuthDto;

    const existing = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const saltOrRounds = 10
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    const token = this.jwtService.sign({id: user.id, email: user.email});
    console.log('Generated Token:', token);
    return {user, token};

   }

   async login (loginAuthDto: LoginAuthDto) {
    const {email, password} = loginAuthDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '1h'});
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
    return {user: safeUser, token};
   }
}
