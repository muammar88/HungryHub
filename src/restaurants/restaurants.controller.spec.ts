import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  const mockRestaurantsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createMenu: jest.fn(),
    findMenu: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantsService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create restaurant', async () => {
      const dto = { name: 'Test Resto' };
      const result = { id: 1, ...dto };

      mockRestaurantsService.create.mockResolvedValue(result);

      const response = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual({
        statusCode: 201,
        message: 'Success',
        error: null,
        data: result,
      });
    });
  });

  describe('findAll', () => {
    it('should return all restaurants', async () => {
      const query = { search: 'test', page: '1', limit: '10' };

      const result = { total: 1, data: [] };
      mockRestaurantsService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith('test', 1, 10);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return single restaurant', async () => {
      const result = { id: 1, name: 'Test' };

      mockRestaurantsService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(response).toEqual({
        message: 'Success',
        data: result,
      });
    });
  });

  describe('update', () => {
    it('should update restaurant', async () => {
      const dto = { name: 'Updated' };
      const result = { id: 1, ...dto };

      mockRestaurantsService.update.mockResolvedValue(result);

      const response = await controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(response).toEqual({
        message: 'Success',
        data: result,
      });
    });
  });

  describe('remove', () => {
    it('should delete restaurant', async () => {
      mockRestaurantsService.remove.mockResolvedValue({
        statusCode: 200,
        message: 'Success',
      });

      const response = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(response).toEqual({
        statusCode: 200,
        message: 'Success',
      });
    });
  });

  describe('createMenu', () => {
    it('should create menu', async () => {
      const dto = { name: 'Menu 1' };
      const result = { id: 1, ...dto };

      mockRestaurantsService.createMenu.mockResolvedValue(result);

      const response = await controller.createMenu('1', dto as any);

      expect(service.createMenu).toHaveBeenCalledWith(1, dto);
      expect(response).toEqual({
        statusCode: 201,
        message: 'Success',
        data: result,
      });
    });
  });

  describe('findMenu', () => {
    it('should return menu list', async () => {
      const query = {
        category: 'main',
        search: 'nasi',
        page: '1',
        limit: '10',
      };

      const result = {
        total: 1,
        data: [],
      };

      mockRestaurantsService.findMenu.mockResolvedValue(result);

      const response = await controller.findMenu('1', query as any);

      expect(service.findMenu).toHaveBeenCalledWith(1, 'main', 'nasi', 1, 10);

      expect(response).toEqual(result);
    });
  });
});
