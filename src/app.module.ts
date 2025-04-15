import { Module } from '@nestjs/common';
import { GamesModule } from './modules/games/games.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './shared/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './modules/auth/services/auth.service';
import { HashHelpers } from './shared/helpers/hash.helper';
import { PrismaService } from './shared/services/prisma.service';
import { JwtProviderService } from './shared/services/jwt-provider.service';

@Module({
  imports: [
    AuthModule,
    GamesModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env`,
    }),
  ],
  controllers: [],
  providers: [
    JwtService,
    AuthService,
    HashHelpers,
    PrismaService,
    JwtProviderService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
