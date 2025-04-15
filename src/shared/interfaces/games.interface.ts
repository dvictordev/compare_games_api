import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IFindUniqueGame {
  @ApiProperty({
    description: ' Nome do jogo',
  })
  @IsString()
  title: string;
}

export class IFindAllGames {
  @ApiProperty({
    description: ' Nome do jogo',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nome da plataforma',
  })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({
    description: 'Paginação',
  })
  @IsNumber()
  @IsOptional()
  page?: number;
}
