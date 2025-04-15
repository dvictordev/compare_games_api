import { BadRequestException, Injectable } from '@nestjs/common';
import { HashHelpers } from 'src/shared/helpers/hash.helper';
import { IUserRegister } from 'src/shared/interfaces/auth.interface';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private hashHelper: HashHelpers,
    private prisma: PrismaService,
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
}
