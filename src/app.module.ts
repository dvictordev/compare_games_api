import { Module } from '@nestjs/common';
import { GamesModule } from './modules/games/games.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
