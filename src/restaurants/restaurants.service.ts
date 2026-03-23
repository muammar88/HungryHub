import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuDto } from '../menu_items/dto/create-menu.dto';

interface MenuItem {
  name: string;
  category?: string;
  price?: number;
}

export interface FindMenuResponse {
  total: number;
  data: MenuItem[];
}

@Injectable()
export class RestaurantsService {
  constructor(
    private prisma: PrismaService,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const restaurant = await this.prisma.restaurant.create({
        data: {
          name: createRestaurantDto.name,
          address: createRestaurantDto.address,
          phone: createRestaurantDto.phone,
          opening_hours: createRestaurantDto.opening_hours,
        },
      });

      await this.elasticsearchService.index({
        index: 'restaurants',
        id: restaurant.id.toString(),
        document: {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          phone: restaurant.phone,
          opening_hours: restaurant.opening_hours,
          menus: [],
        },
      });

      return restaurant;
    } catch (error) {
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException('Gagal membuat data restaurant');
    }
  }

  async findOne(id: number) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id },
      });

      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant dengan ID ${id} tidak ditemukan`,
        );
      }

      return restaurant;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Gagal mengambil detail restaurant',
      );
    }
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; total: number }> {
    try {
      const from = (page - 1) * limit;

      const query = search
        ? {
            multi_match: {
              query: search,
              fields: ['name', 'address', 'menus.name', 'menus.category'],
              fuzziness: 'AUTO',
            },
          }
        : {
            match_all: {},
          };

      const result = await this.elasticsearchService.search({
        index: 'restaurants',
        from,
        size: limit,
        query,
      });

      const total =
        typeof result.hits.total === 'number'
          ? result.hits.total
          : (result.hits.total?.value ?? 0);

      return {
        total,
        data: result.hits.hits.map((item: any) => {
          const { menus, ...row } = item._source;
          return row;
        }),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil data dari Elasticsearch',
      );
    }
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant dengan ID ${id} tidak ditemukan`);
    }

    const updated = await this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });

    await this.elasticsearchService.update({
      index: 'restaurants',
      id: id.toString(),
      doc: {
        name: updated.name,
        address: updated.address,
        phone: updated.phone,
        opening_hours: updated.opening_hours,
      },
      doc_as_upsert: true,
    });

    return updated;
  }

  async remove(id: number) {
    try {
      const restaurant = await this.findOne(id);

      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant dengan ID ${id} tidak ditemukan`,
        );
      }

      await this.prisma.restaurant.delete({
        where: { id },
      });

      await this.elasticsearchService.delete({
        index: 'restaurants',
        id: id.toString(),
      });

      return {
        statusCode: 200,
        message: 'Restaurant berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Gagal menghapus data restaurant');
    }
  }

  async createMenu(restaurantId: number, dto: CreateMenuDto) {
    try {
      const restaurant = await this.findOne(restaurantId);

      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant dengan ID ${restaurantId} tidak ditemukan`,
        );
      }

      const menu = await this.prisma.menuItem.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          category: dto.category,
          is_available: dto.is_available ?? false,
          restaurantId,
        },
      });

      const menus = await this.prisma.menuItem.findMany({
        where: { restaurantId },
      });

      await this.elasticsearchService.update({
        index: 'restaurants',
        id: restaurantId.toString(),
        doc: {
          menus: menus.map((m) => ({
            id: m.id,
            name: m.name,
            category: m.category,
            price: Number(m.price),
            is_available: m.is_available,
          })),
        },
        doc_as_upsert: true,
      });

      return menu;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Gagal membuat menu');
    }
  }

  async findMenu(
    restaurantId: number,
    category?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<FindMenuResponse> {
    try {
      const result = await this.elasticsearchService.get({
        index: 'restaurants',
        id: restaurantId.toString(),
      });

      const source = result._source as { menus: MenuItem[] };

      if (!source) {
        throw new NotFoundException(
          `Restaurant dengan ID ${restaurantId} tidak ditemukan`,
        );
      }

      let menus: MenuItem[] = source.menus ?? [];

      const allowedCategories = ['appetizer', 'main', 'dessert', 'drink'];

      if (category) {
        const cat = category.trim().toLowerCase();

        if (!allowedCategories.includes(cat)) {
          throw new BadRequestException(
            `Category tidak valid. Gunakan: ${allowedCategories.join(', ')}`,
          );
        }

        menus = menus.filter((menu) => menu.category?.toLowerCase() === cat);
      }

      // 🔍 FILTER SEARCH
      if (search) {
        const keyword = search.trim().toLowerCase();
        menus = menus.filter((menu) =>
          menu.name.toLowerCase().includes(keyword),
        );
      }

      // 📄 VALIDASI PAGINATION
      page = page < 1 ? 1 : page;
      limit = limit < 1 ? 10 : limit;

      // 📄 PAGINATION
      const total = menus.length;
      const start = (page - 1) * limit;
      const end = start + limit;

      const data = menus.slice(start, end);

      return {
        total,
        data,
      };
    } catch (error) {
      if (error?.meta?.statusCode === 404) {
        throw new NotFoundException(
          `Restaurant dengan ID ${restaurantId} tidak ditemukan`,
        );
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Gagal mengambil data dari Elasticsearch',
      );
    }
  }
}
