import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= LOGIN =================
  describe('login', () => {
    it('should login successfully', async () => {
      const dto = { username: 'admin', password: '123' };

      const user = {
        id: 1,
        username: 'admin',
        fullname: 'Admin',
        password: 'hashed',
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwt.signAsync.mockResolvedValue('token');
      mockConfig.get.mockReturnValue('secret');

      const result = await service.login(dto as any);

      expect(result.data.access_token).toBe('token');
      expect(result.data.refresh_token).toBe('token');
    });

    it('should throw Unauthorized if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ username: 'x', password: 'x' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if password wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'admin',
        password: 'hashed',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ username: 'admin', password: 'wrong' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ================= REFRESH TOKEN =================
  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const dto = { refresh_token: 'valid' };

      const payload = {
        id: 1,
        username: 'admin',
        fullname: 'Admin',
      };

      mockJwt.verifyAsync.mockResolvedValue(payload);
      mockJwt.signAsync.mockResolvedValue('new-token');

      mockConfig.get.mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return 'secret';
        if (key === 'JWT_REFRESH_EXPIRES') return '1d';
        if (key === 'JWT_EXPIRES') return '60';
      });

      const result = await service.refreshToken(dto as any);

      expect(result.data.access_token).toBe('new-token');
      expect(result.data.refresh_token).toBe('new-token');
    });

    it('should throw Unauthorized if token invalid', async () => {
      mockJwt.verifyAsync.mockRejectedValue(new Error());

      await expect(
        service.refreshToken({ refresh_token: 'invalid' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ================= FIND USER =================
  describe('findOneByUsername', () => {
    it('should return user', async () => {
      const user = { id: 1, username: 'admin' };

      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOneByUsername('admin');

      expect(result).toEqual(user);
    });
  });
});
