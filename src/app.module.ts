import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuItemsModule } from './menu_items/menu_items.module';
import { PrismaModule } from './prisma/prisma.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 🔥 WAJIB: aktifkan .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ElasticsearchModule,
    PrismaModule,
    RestaurantsModule,
    MenuItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
