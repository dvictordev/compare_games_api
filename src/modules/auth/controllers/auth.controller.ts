import { Body, Controller, Post } from '@nestjs/common';
import { IUserAuth, IUserRegister } from 'src/shared/interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { runInThisContext } from 'vm';
import { Public } from 'src/shared/decorator/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with the provided credentials',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  async register(@Body() data: IUserRegister) {
    const user = await this.authService.storeUser(data);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate a user with the provided credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        token: 'your_token',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async login(@Body() data: IUserAuth) {
    const login = await this.authService.login(data);

    return login;
  }
}
