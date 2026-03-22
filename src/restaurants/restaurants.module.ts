import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  controllers: [RestaurantsController],
  imports: [PrismaModule, ElasticsearchModule],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
