import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IFindUniqueGame {
  @ApiProperty()
  @IsString()
  title: string;
}

export class IFindAllGames {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  platform?: number;
}
