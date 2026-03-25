import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const mockPrisma = {
    restaurant: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    menuItem: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockElastic = {
    index: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ElasticsearchService, useValue: mockElastic },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= CREATE =================
  describe('create', () => {
    it('should create restaurant & index to elastic', async () => {
      const dto = { name: 'Test', address: 'A' };
      const restaurant = { id: 1, ...dto };

      mockPrisma.restaurant.create.mockResolvedValue(restaurant);

      const result = await service.create(dto as any);

      expect(mockPrisma.restaurant.create).toHaveBeenCalled();
      expect(mockElastic.index).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
    });
  });

  // ================= FIND ONE =================
  describe('findOne', () => {
    it('should return restaurant', async () => {
      const data = { id: 1, name: 'Test' };

      mockPrisma.restaurant.findUnique.mockResolvedValue(data);

      const result = await service.findOne(1);

      expect(result).toEqual(data);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ================= FIND ALL =================
  describe('findAll', () => {
    it('should return data from elasticsearch', async () => {
      mockElastic.search.mockResolvedValue({
        hits: {
          total: { value: 1 },
          hits: [
            {
              _source: {
                id: 1,
                name: 'Resto',
                menus: [],
              },
            },
          ],
        },
      });

      const result = await service.findAll('', 1, 10);

      expect(result.total).toBe(1);
      expect(result.data[0].name).toBe('Resto');
    });
  });

  // ================= UPDATE =================
  describe('update', () => {
    it('should update restaurant', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as any);

      mockPrisma.restaurant.update.mockResolvedValue({
        id: 1,
        name: 'Updated',
      });

      const result = await service.update(1, { name: 'Updated' });

      expect(mockPrisma.restaurant.update).toHaveBeenCalled();
      expect(mockElastic.update).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
    });
  });

  // ================= REMOVE =================
  describe('remove', () => {
    it('should delete restaurant', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as any);

      const result = await service.remove(1);

      expect(mockPrisma.restaurant.delete).toHaveBeenCalled();
      expect(mockElastic.delete).toHaveBeenCalled();
      expect(result.message).toBe('Restaurant berhasil dihapus');
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ================= CREATE MENU =================
  describe('createMenu', () => {
    it('should create menu and update elastic', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as any);

      mockPrisma.menuItem.create.mockResolvedValue({ id: 1 });
      mockPrisma.menuItem.findMany.mockResolvedValue([]);

      const result = await service.createMenu(1, {
        name: 'Menu',
      } as any);

      expect(mockPrisma.menuItem.create).toHaveBeenCalled();
      expect(mockElastic.update).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });
  });

  // ================= FIND MENU =================
  describe('findMenu', () => {
    it('should filter by category and search', async () => {
      mockElastic.get.mockResolvedValue({
        _source: {
          menus: [
            { name: 'Nasi Goreng', category: 'main' },
            { name: 'Es Teh', category: 'drink' },
          ],
        },
      });

      const result = await service.findMenu(1, 'main', 'nasi', 1, 10);

      expect(result.total).toBe(1);
      expect(result.data[0].name).toBe('Nasi Goreng');
    });

    it('should throw BadRequestException if category invalid', async () => {
      mockElastic.get.mockResolvedValue({
        _source: { menus: [] },
      });

      await expect(service.findMenu(1, 'invalid', '', 1, 10)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      mockElastic.get.mockRejectedValue({
        meta: { statusCode: 404 },
      });

      await expect(service.findMenu(1)).rejects.toThrow(NotFoundException);
    });
  });
});
