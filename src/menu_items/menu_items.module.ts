import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { MenuItemsController } from './menu_items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  controllers: [MenuItemsController],
  imports: [PrismaModule, ElasticsearchModule],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
