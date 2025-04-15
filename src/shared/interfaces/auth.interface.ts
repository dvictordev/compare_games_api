import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, Min, MinLength } from 'class-validator';

export class IUserRegister {
  @ApiProperty({
    required: true,
    description: 'Nome do usuário',
  })
  @IsString()
  name: string;
  @ApiProperty({
    required: true,
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Senha do usuário',
  })
  @MinLength(6)
  password: string;
}
