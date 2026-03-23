import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindMenuQueryDto {
  @IsNotEmpty({ message: 'Page wajib diisi' })
  @IsNumberString({}, { message: 'Page haurs dalam angka' })
  page: string;

  @IsNotEmpty({ message: 'Limit wajib diisi' })
  @IsNumberString({}, { message: 'Limit haurs dalam angka' })
  limit: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
