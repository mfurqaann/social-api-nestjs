import {  Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { UserService } from './user.service.js';
import { PostService } from './post.service.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
