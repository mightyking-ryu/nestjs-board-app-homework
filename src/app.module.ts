import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    BoardsModule,
    AuthModule,
    PrismaModule
  ],
})
export class AppModule {}
