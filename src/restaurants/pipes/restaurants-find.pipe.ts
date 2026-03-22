import {
  PipeTransform,
  Injectable,
  NotFoundException,
  ArgumentMetadata,
} from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsEntity } from '../entities/restaurant.entity';
import { RestaurantsService } from '../restaurants.service';

@Injectable()
export class FindRestaurantPipe implements PipeTransform<number> {
  //   constructor(private prisma: PrismaService) {}
  constructor(private readonly restaurantService: RestaurantsService) {}

  async transform(id: number) {
    // const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new NotFoundException('Format ID Restaurant tidak valid');
    }
    const restaurant = await this.restaurantService.findOne(id);
    if (!restaurant) {
      throw new NotFoundException(`Sekolah dengan ID ${id} tidak ditemukan`);
    }
    return restaurant;
  }

  //   async transform(value: number) {
  //     const restaurant = await this.prisma.restaurant.findUnique({
  //       where: { id: value },
  //     });

  //     if (!restaurant) {
  //       throw new NotFoundException('Restaurant tidak ditemukan');
  //     }

  //     return restaurant; // langsung return object
  //   }
}

// import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
// import { Sekolah } from '../entities/sekolah.entity';
// import { SekolahService } from '../sekolah.service';

// @Injectable()
// export class FindSekolahPipe implements PipeTransform {
//   constructor(private readonly sekolahService: SekolahService) {}

//   async transform(value: any): Promise<Sekolah | null> {
//     const id = parseInt(value, 10);
//     if (isNaN(id)) {
//       throw new NotFoundException('Format ID Sekolah tidak valid');
//     }

//     const sekolah = await this.sekolahService.findOne(id);
//     if (!sekolah) {
//       throw new NotFoundException(`Sekolah dengan ID ${id} tidak ditemukan`);
//     }

//     return sekolah;
//   }
// }
