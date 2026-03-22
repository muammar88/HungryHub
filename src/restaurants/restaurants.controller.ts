import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuDto } from '../menu_items/dto/create-menu.dto';

@ApiTags('restaurants')
@Controller('restaurants')
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
  @ApiOkResponse({
    description: 'Daftar semua restaurant.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        error: null,
        data: [
          {
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
        ],
      },
    },
  })
  findAll() {
    return this.restaurantsService.findAll();
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
  @ApiParam({ name: 'id', description: 'ID restaurant', type: Number })
  @ApiOkResponse({
    description: 'Daftar menu berhasil diambil',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        error: null,
        data: {
          restaurantId: 2,
          menus: [
            {
              name: 'Ayam Penyet',
              category: 'Makanan',
              price: 25000,
              is_available: true,
            },
            {
              name: 'Lele Goreng',
              category: 'Makanan',
              price: 20000,
              is_available: true,
            },
            {
              name: 'Nasi Uduk',
              category: 'Makanan',
              price: 15000,
              is_available: true,
            },
            {
              name: 'Jus Jeruk',
              category: 'Minuman',
              price: 10000,
              is_available: true,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant tidak ditemukan',
  })
  async findMenu(@Param('id') id: string) {
    const menu = await this.restaurantsService.findMenu(+id);

    return {
      statusCode: 200,
      message: 'Success',
      error: null,
      data: menu,
    };
  }
}
