import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsService } from './menu_items.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { NotFoundException } from '@nestjs/common';

describe('MenuItemsService', () => {
  let service: MenuItemsService;

  const mockPrisma = {
    menuItem: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    restaurant: {
      findUnique: jest.fn(),
    },
  };

  const mockElastic = {
    index: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ElasticsearchService, useValue: mockElastic },
      ],
    }).compile();

    service = module.get<MenuItemsService>(MenuItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= FIND ONE =================
  describe('findOne', () => {
    it('should return menu item', async () => {
      const menu = { id: 1, name: 'Menu' };

      mockPrisma.menuItem.findUnique.mockResolvedValue(menu);

      const result = await service.findOne(1);

      expect(result).toEqual(menu);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ================= UPDATE =================
  describe('update', () => {
    it('should update menu and reindex elasticsearch', async () => {
      const menu = { id: 1, restaurantId: 10 };

      jest.spyOn(service, 'findOne').mockResolvedValue(menu as any);

      mockPrisma.menuItem.update.mockResolvedValue({
        id: 1,
        name: 'Updated',
        restaurantId: 10,
      });

      mockPrisma.restaurant.findUnique.mockResolvedValue({
        id: 10,
        name: 'Resto',
        address: 'A',
        phone: '08',
        opening_hours: '9-10',
        menuItems: [],
      });

      const result = await service.update(1, { name: 'Updated' });

      expect(mockPrisma.menuItem.update).toHaveBeenCalled();
      expect(mockElastic.index).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Success',
        data: expect.objectContaining({ id: 1 }),
      });
    });

    it('should throw NotFoundException if menu not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        restaurantId: 10,
      } as any);

      mockPrisma.menuItem.update.mockResolvedValue({
        id: 1,
        restaurantId: 10,
      });

      mockPrisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ================= REMOVE =================
  describe('remove', () => {
    it('should delete menu and update elasticsearch', async () => {
      const menu = { id: 1, restaurantId: 10 };

      jest.spyOn(service, 'findOne').mockResolvedValue(menu as any);

      mockPrisma.restaurant.findUnique.mockResolvedValue({
        id: 10,
        name: 'Resto',
        address: 'A',
        phone: '08',
        opening_hours: '9-10',
        menuItems: [],
      });

      const result = await service.remove(1);

      expect(mockPrisma.menuItem.delete).toHaveBeenCalled();
      expect(mockElastic.index).toHaveBeenCalled();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Menu berhasil dihapus',
      });
    });

    it('should throw NotFoundException if menu not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        restaurantId: 10,
      } as any);

      mockPrisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
