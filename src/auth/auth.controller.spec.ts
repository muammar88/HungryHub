import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= LOGIN =================
  describe('login', () => {
    it('should return login response', async () => {
      const dto = {
        username: 'admin',
        password: 'admin',
      };

      const result = {
        data: {
          access_token: 'token',
          refresh_token: 'refresh',
        },
      };

      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(dto as any);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  // ================= REFRESH =================
  describe('refresh', () => {
    it('should return new tokens', async () => {
      const dto = {
        refresh_token: 'token',
      };

      const result = {
        data: {
          access_token: 'new-token',
          refresh_token: 'new-refresh',
        },
      };

      mockAuthService.refreshToken.mockResolvedValue(result);

      const response = await controller.refresh(dto as any);

      expect(service.refreshToken).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });
});
