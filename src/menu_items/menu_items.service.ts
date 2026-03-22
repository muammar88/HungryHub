import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    private prisma: PrismaService,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async findOne(id: number) {
    try {
      const menus = await this.prisma.menuItem.findUnique({
        where: { id },
      });

      if (!menus) {
        throw new NotFoundException(
          `Menu Item dengan ID ${id} tidak ditemukan`,
        );
      }

      return menus;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Gagal mengambil detail menu item',
      );
    }
  }

  async update(id: number, dto: UpdateMenuDto) {
    try {
      await this.findOne(id);

      const updatedMenu = await this.prisma.menuItem.update({
        where: { id },
        data: dto,
      });

      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: updatedMenu.restaurantId },
        include: {
          menuItems: true,
        },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant tidak ditemukan');
      }

      try {
        await this.elasticsearchService.index({
          index: 'restaurants',
          id: restaurant.id.toString(),
          document: {
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            opening_hours: restaurant.opening_hours,
            menus: restaurant.menuItems.map((m) => ({
              name: m.name,
              category: m.category,
              price: Number(m.price),
              is_available: m.is_available,
            })),
          },
        });
      } catch (err) {
        console.error('Gagal update ke Elasticsearch', err);
      }

      return {
        message: 'Success',
        data: updatedMenu,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Gagal mengupdate data menu');
    }
  }

  async remove(id: number) {
    try {
      const menu = await this.findOne(id);

      await this.prisma.menuItem.delete({
        where: { id },
      });

      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: menu.restaurantId },
        include: {
          menuItems: true,
        },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant tidak ditemukan');
      }

      await this.elasticsearchService.index({
        index: 'restaurants',
        id: restaurant.id.toString(),
        document: {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          phone: restaurant.phone,
          opening_hours: restaurant.opening_hours,
          menus: restaurant.menuItems.map((m) => ({
            name: m.name,
            category: m.category,
            price: Number(m.price),
            is_available: m.is_available,
          })),
        },
      });

      return {
        statusCode: 200,
        message: 'Menu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Gagal menghapus data menu');
    }
  }
}
