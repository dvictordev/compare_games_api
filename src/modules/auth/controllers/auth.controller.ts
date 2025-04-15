import { Body, Controller, Post } from '@nestjs/common';
import { IUserRegister } from 'src/shared/interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: IUserRegister) {
    const user = await this.authService.storeUser(data);
    return {
      message: 'User registered successfully',
      user,
    };
  }
}
