import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
// import { UserService } from 'src/administrator/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { RefreshAuthDto } from './dto/refresh.dto';

interface JwtPayload {
  id: number;
  username: string;
  fullname: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
    };

    return {
      data: {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtService.signAsync(payload, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
        }),
      },
    };
  }

  async refreshToken(dto: RefreshAuthDto) {
    try {
      const payloadVerify = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refresh_token,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const payload = {
        id: payloadVerify.id,
        username: payloadVerify.username,
        fullname: payloadVerify.fullname,
      };

      return {
        data: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: Number(
              this.configService.get<string>('JWT_EXPIRES') ?? 60,
            ),
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
          }),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }
}
