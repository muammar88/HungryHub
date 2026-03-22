import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsString({ message: 'Alamat harus berupa teks' })
  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  address: string;

  @IsString({ message: 'No HP harus berupa teks' })
  phone: string;

  @IsString({ message: 'Jam buka harus berupa teks' })
  opening_hours: string;
}
