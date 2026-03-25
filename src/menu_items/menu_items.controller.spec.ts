import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu_items.controller';
import { MenuItemsService } from './menu_items.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;
  let service: MenuItemsService;

  const mockMenuItemsService = {
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
          useValue: mockMenuItemsService,
        },
      ],
    })
      // 🔥 bypass JwtAuthGuard
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
    service = module.get<MenuItemsService>(MenuItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update menu item', async () => {
      const dto = {
        name: 'Nasi Goreng',
        price: 25000,
      };

      const result = {
        id: 1,
        ...dto,
      };

      mockMenuItemsService.update.mockResolvedValue(result);

      const response = await controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);

      expect(response).toEqual({
        message: 'Success',
        data: result,
      });
    });
  });

  describe('remove', () => {
    it('should delete menu item', async () => {
      const result = {
        statusCode: 200,
        message: 'Menu berhasil dihapus',
      };

      mockMenuItemsService.remove.mockResolvedValue(result);

      const response = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(response).toEqual(result);
    });
  });
});
