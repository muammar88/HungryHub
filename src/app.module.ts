import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuItemsModule } from './menu_items/menu_items.module';

@Module({
  imports: [RestaurantsModule, MenuItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
