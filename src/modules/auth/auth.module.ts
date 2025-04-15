import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { HashHelpers } from 'src/shared/helpers/hash.helper';
import { JwtProviderService } from 'src/shared/services/jwt-provider.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    HashHelpers,
    JwtProviderService,
    JwtService,
  ],
})
export class AuthModule {}
