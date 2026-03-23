import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login on service', async () => {
    const dto = { username: 'admin', password: 'password' };
    const mockResult = { access_token: 'token', refresh_token: 'ref' };
    (service.login as jest.Mock).mockResolvedValue(mockResult);

    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockResult);
  });

  it('should call refreshToken on service', async () => {
    const refreshToken = 'lama_ref';
    const mockResult = {
      access_token: 'baru_token',
      refresh_token: 'baru_ref',
    };
    (service.refreshToken as jest.Mock).mockResolvedValue(mockResult);

    const result = await controller.refresh(refreshToken);
    expect(service.refreshToken).toHaveBeenCalledWith(refreshToken);
    expect(result).toBe(mockResult);
  });
});
