import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { NotFoundException } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CREATE
  it('should create restaurant', async () => {
    const dto = {
      name: 'Test Resto',
      address: 'Test Address',
      phone: '123',
      opening_hours: '09-17',
    };

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

  // FIND ALL
  it('should return all restaurants', async () => {
    const result = [{ id: 1, name: 'Resto' }];

    mockRestaurantsService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  // FIND ONE
  it('should return one restaurant', async () => {
    const result = { id: 1, name: 'Resto' };

    mockRestaurantsService.findOne.mockResolvedValue(result);

    const response = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(response).toEqual({
      message: 'Success',
      data: result,
    });
  });

  it('should throw NotFoundException if restaurant not found', async () => {
    mockRestaurantsService.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // UPDATE
  it('should update restaurant', async () => {
    const dto = {
      name: 'Updated',
      address: 'New Address',
      phone: '123',
      opening_hours: '10-18',
    };

    const result = { id: 1, ...dto };

    mockRestaurantsService.update.mockResolvedValue(result);

    const response = await controller.update('1', dto as any);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(response).toEqual({
      message: 'Success',
      data: result,
    });
  });

  // DELETE
  it('should remove restaurant', async () => {
    mockRestaurantsService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
  });

  // CREATE MENU
  it('should create menu', async () => {
    const dto = {
      name: 'Nasi Goreng',
      description: 'Enak',
      price: 20000,
      category: 'Makanan',
      is_available: true,
    };

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

  // FIND MENU
  it('should return menus by restaurant id', async () => {
    const result = {
      restaurantId: 1,
      menus: [],
    };

    mockRestaurantsService.findMenu.mockResolvedValue(result);

    const response = await controller.findMenu('1');

    expect(service.findMenu).toHaveBeenCalledWith(1);
    expect(response).toEqual({
      statusCode: 200,
      message: 'Success',
      error: null,
      data: result,
    });
  });
});
