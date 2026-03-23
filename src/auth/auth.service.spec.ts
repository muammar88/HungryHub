import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/administrator/user/user.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login', async () => {
    const mockUser = {
      id: 1,
      username: 'admin',
      fullname: 'Admin User',
      password: 'hashed_password',
    };

    (userService.findOneByUsername as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await service.login({
      username: 'admin',
      password: 'password',
    });

    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });

  it('should refresh token', async () => {
    const mockPayload = { id: 1, username: 'admin', fullname: 'Admin User' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('new_token');

    const result = await service.refreshToken('refresh_token');
    expect(result).toBeDefined();
    expect(result.access_token).toBe('new_token');
  });
});
