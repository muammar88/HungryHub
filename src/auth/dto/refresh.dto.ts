import { IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  refresh_token: string;
}
