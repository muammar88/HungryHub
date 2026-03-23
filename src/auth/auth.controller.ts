import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshAuthDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    type: AuthDto,
    examples: {
      example1: {
        summary: 'Login admin',
        value: {
          username: 'admin',
          password: 'admin',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Login success',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        error: null,
        data: {
          access_token: 'xxx',
          refresh_token: 'xxx',
        },
      },
    },
  })
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({
    schema: {
      example: {
        refresh_token: 'your_refresh_token_here',
      },
    },
  })
  @ApiOkResponse({
    description: 'Refresh token success',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        error: null,
        data: {
          access_token: 'xxx',
          refresh_token: 'xxx',
        },
      },
    },
  })
  async refresh(@Body() dto: RefreshAuthDto) {
    return await this.authService.refreshToken(dto);
  }
}
