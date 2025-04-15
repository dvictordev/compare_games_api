import { Body, Controller, Post } from '@nestjs/common';
import { IUserAuth, IUserRegister } from 'src/shared/interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { runInThisContext } from 'vm';
import { Public } from 'src/shared/decorator/public.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() data: IUserRegister) {
    const user = await this.authService.storeUser(data);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Public()
  @Post('login')
  async login(@Body() data: IUserAuth) {
    const login = await this.authService.login(data);

    return login;
  }
}
