import {
  Controller,
  Put,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MenuItemsService } from './menu_items.service';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('menu_items')
@Controller('menu_items')
@UseGuards(JwtAuthGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update menu berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID menu', type: Number })
  @ApiBody({
    description: 'Data untuk update menu',
    schema: {
      example: {
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur dan ayam',
        price: 25000,
        category: 'Makanan',
        is_available: true,
      },
    },
  })
  @ApiOkResponse({
    description: 'Menu berhasil diupdate',
    schema: {
      example: {
        message: 'Success',
        data: {
          id: 1,
          name: 'Nasi Goreng Spesial',
          description: 'Nasi goreng dengan telur dan ayam',
          price: 25000,
          category: 'Makanan',
          is_available: true,
          restaurantId: 2,
          updatedAt: '2026-03-22T10:00:00.000Z',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const menus = await this.menuItemsService.update(+id, updateMenuDto);

    return {
      message: 'Success',
      data: menus,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus menu berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID menu', type: Number })
  @ApiOkResponse({
    description: 'Menu berhasil dihapus',
    schema: {
      example: {
        statusCode: 200,
        message: 'Menu berhasil dihapus',
      },
    },
  })
  async remove(@Param('id') id: string) {
    return await this.menuItemsService.remove(+id);
  }
}
