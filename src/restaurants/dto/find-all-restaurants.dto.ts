import {
  IsOptional,
  IsString,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';

export class FindAllRestaurantsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNotEmpty({ message: 'Page wajib diisi' })
  @IsNumberString({}, { message: 'Page harus dalam angka' })
  page: string;

  @IsNotEmpty({ message: 'Limit wajib diisi' })
  @IsNumberString({}, { message: 'Limit harus dalam angka' })
  limit: string;
}
