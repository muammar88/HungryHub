import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuDto } from '../menu_items/dto/create-menu.dto';

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

  async findAll() {
    try {
      const result = await this.elasticsearchService.search({
        index: 'restaurants',
        query: {
          match_all: {},
        },
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

  async findMenu(restaurantId: number) {
    try {
      const result = await this.elasticsearchService.get({
        index: 'restaurants',
        id: restaurantId.toString(),
      });

      const source = result._source as any;

      if (!source) {
        throw new NotFoundException(
          `Restaurant dengan ID ${restaurantId} tidak ditemukan`,
        );
      }

      return {
        restaurantId,
        menus: source.menus ?? [],
      };
    } catch (error) {
      if (error?.meta?.statusCode === 404) {
        throw new NotFoundException(
          `Restaurant dengan ID ${restaurantId} tidak ditemukan`,
        );
      }

      throw new InternalServerErrorException(
        'Gagal mengambil data menu dari Elasticsearch',
      );
    }
  }
}
