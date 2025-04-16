import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    required: true,
    description: 'Nome do usuário',
  })
  @IsString()
  @IsNotEmpty({
    message: 'O campo nome é obrigatório',
  })
  name: string;
  @ApiProperty({
    required: true,
    description: 'Email do usuário',
  })
  @IsEmail(
    {},
    {
      message: 'Email inválido',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
    description: 'Senha do usuário',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;
}

export class AuthenticateUserDto {
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
  password: string;
}
