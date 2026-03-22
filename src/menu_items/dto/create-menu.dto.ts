import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Spesial' })
  @IsString({ message: 'Nama menu harus berupa teks' })
  @IsNotEmpty({ message: 'Nama menu tidak boleh kosong' })
  name: string;

  @ApiPropertyOptional({ example: 'Nasi goreng dengan telur dan ayam' })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa teks' })
  description?: string;

  @ApiProperty({ example: 22000 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  price: number;

  @ApiProperty({ example: 'Makanan' })
  @IsString({ message: 'Kategori harus berupa teks' })
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean({ message: 'is_available harus berupa boolean' })
  is_available?: boolean;
}
