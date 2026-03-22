import { PrismaClient } from '@prisma/client';
import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';
import restaurantsAndMenusSeed from './seeds/restaurantsAndMenus.seed';

dotenv.config();

const prisma = new PrismaClient();

const esClient = new Client({
  node: process.env.ELASTIC_NODE!,
  auth: {
    username: process.env.ELASTIC_USERNAME!,
    password: process.env.ELASTIC_PASSWORD!,
  },
});

async function main() {
  console.log('Seeding Restaurants and Menus...');
  // helper to mimic service
  const esService = {
    index: (index: string, id: string, document: any) =>
      esClient.index({
        index,
        id,
        document,
      }),
    deleteByQuery: (index: string, query: any) =>
      esClient.deleteByQuery({
        index,
        body: query,
      }),
    deleteIndex: (index: string) =>
      esClient.indices.delete({
        index,
      }),
  };

  await restaurantsAndMenusSeed(prisma, esService);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
