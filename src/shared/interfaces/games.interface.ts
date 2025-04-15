import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IFindUniqueGame {
  @ApiProperty()
  @IsString()
  title: string;
}
