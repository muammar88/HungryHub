import { Exclude } from 'class-transformer';

export class RestaurantsEntity {
  id: number;
  name: string;
  address: string;
  phone?: string;
  opening_hours?: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<RestaurantsEntity>) {
    Object.assign(this, partial);
  }
}
