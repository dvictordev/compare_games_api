import { BadRequestException, Injectable } from '@nestjs/common';
import { HashHelpers } from 'src/shared/helpers/hash.helper';
import { IUserAuth, IUserRegister } from 'src/shared/interfaces/auth.interface';
import { JwtProviderService } from 'src/shared/services/jwt-provider.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private hashHelper: HashHelpers,
    private prisma: PrismaService,
    private readonly jwtProviderService: JwtProviderService,
  ) {}

  async storeUser(data: IUserRegister) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashHelper.generateHash(data.password);

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return {
      name: newUser.name,
      email: newUser.email,
    };
  }

  async login(data: IUserAuth) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!(await this.hashHelper.compareHash(data.password, user.password))) {
        throw new BadRequestException('Invalid password!');
      }

      const token = await this.jwtProviderService.generateAccessToken({
        sub: user.email,
        expiresIn: '60m',
      });

      return {
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async show(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
