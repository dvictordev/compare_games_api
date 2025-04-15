import { Module } from '@nestjs/common';
import { GamesModule } from './modules/games/games.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    GamesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
