import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuDto } from '../menu_items/dto/create-menu.dto';
import { FindAllRestaurantsDto } from './dto/find-all-restaurants.dto';
import { FindMenuQueryDto } from './dto/find-menu-query.dto';

import { FindMenuResponse } from './restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Buat restaurant baru' })
  @ApiBody({
    description: 'Data untuk membuat restaurant',
    schema: {
      example: {
        name: 'Ayam penyet pak ulis',
        address: 'Jln Margonda nomor 3',
        phone: '08557576212',
        opening_hours: '09.00-21.00',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Restaurant berhasil dibuat.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        error: null,
        data: {
          id: 1,
          name: 'Ayam penyet pak ulis',
          address: 'Jln Margonda nomor 3',
          phone: '08557576212',
          opening_hours: '09.00-21.00',
          createdAt: '2026-03-22T13:00:00.000Z',
          updatedAt: '2026-03-22T13:00:00.000Z',
        },
      },
    },
  })
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const restaurant =
      await this.restaurantsService.create(createRestaurantDto);

    return {
      statusCode: 201,
      message: 'Success',
      error: null,
      data: restaurant,
    };
  }
  @Get()
  @ApiOperation({ summary: 'Ambil semua restaurant' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Keyword pencarian nama restaurant (opsional)',
    example: 'nusantara',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Halaman (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Jumlah data per halaman (default: 10)',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Daftar semua restaurant',
    schema: {
      example: {
        total: 1,
        data: [
          {
            id: 1,
            name: 'Resto Nusantara',
            address: 'Jl. Sudirman No. 1',
            menus: [
              {
                name: 'Nasi Goreng Spesial',
                category: 'main',
                price: 22000,
              },
            ],
          },
        ],
      },
    },
  })
  findAll(@Query() query: FindAllRestaurantsDto) {
    return this.restaurantsService.findAll(
      query.search,
      +query.page,
      +query.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil restaurant berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID restaurant', type: Number })
  @ApiOkResponse({
    description: 'Restaurant ditemukan.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        error: null,
        data: {
          id: 1,
          name: 'Resto Nusantara',
          address: 'Jl. Sudirman No. 1',
          menus: [
            {
              name: 'Nasi Goreng Spesial',
              category: 'Makanan',
              price: 22000,
            },
          ],
        },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findOne(+id);

    return {
      message: 'Success',
      data: restaurant,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update restaurant berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID restaurant', type: Number })
  @ApiBody({
    description: 'Data untuk update restaurant',
    schema: {
      example: {
        name: 'Ayam penyet pak ulis (updated)',
        address: 'Jln Margonda nomor 5',
        phone: '08123456789',
        opening_hours: '10.00-22.00',
      },
    },
  })
  @ApiOkResponse({
    description: 'Restaurant berhasil diupdate.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        error: null,
        data: {
          id: 1,
          name: 'Ayam penyet pak ulis (updated)',
          address: 'Jln Margonda nomor 5',
          phone: '08123456789',
          opening_hours: '10.00-22.00',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantsService.update(
      +id,
      updateRestaurantDto,
    );

    return {
      message: 'Success',
      data: restaurant,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus restaurant berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID restaurant', type: Number })
  @ApiOkResponse({
    description: 'Restaurant berhasil dihapus.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        error: null,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }

  @Post(':id/menu_items')
  @ApiOperation({ summary: 'Tambah menu ke restaurant' })
  @ApiParam({ name: 'id', description: 'ID restaurant', type: Number })
  @ApiBody({
    description: 'Data menu',
    schema: {
      example: {
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur dan ayam',
        price: 22000,
        category: 'Makanan',
        is_available: true,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Menu berhasil ditambahkan',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        error: null,
        data: {
          id: 13,
          name: 'Ayam KALASAN',
          description: 'Masakan ayam kalasan',
          price: 33000,
          category: 'Makanan',
          is_available: true,
          restaurantId: 2,
          createdAt: '2026-03-22T13:23:59.328Z',
          updatedAt: '2026-03-22T13:23:59.328Z',
        },
      },
    },
  })
  async createMenu(@Param('id') id: string, @Body() dto: CreateMenuDto) {
    const menu = await this.restaurantsService.createMenu(+id, dto);

    return {
      statusCode: 201,
      message: 'Success',
      data: menu,
    };
  }

  @Get(':id/menu_items')
  @ApiOperation({ summary: 'Ambil semua menu berdasarkan ID restaurant' })
  @ApiParam({
    name: 'id',
    description: 'ID restaurant',
    type: Number,
  })

  // ✅ CATEGORY dengan enum
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['appetizer', 'main', 'dessert', 'drink'],
    description: 'Filter kategori menu',
    example: 'main',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'nasi',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Daftar menu berhasil diambil',
    schema: {
      example: {
        total: 2,
        data: [
          {
            name: 'Nasi Goreng',
            category: 'main',
            price: 20000,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Category tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant tidak ditemukan',
  })
  async findMenu(
    @Param('id') id: string,
    @Query() query: FindMenuQueryDto,
  ): Promise<FindMenuResponse> {
    return this.restaurantsService.findMenu(
      +id,
      query.category,
      query.search,
      +query.page,
      +query.limit,
    );
  }
}
