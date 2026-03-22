import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchService {
  private client: Client;

  constructor(private configService: ConfigService) {
    const node = this.configService.get<string>('ELASTIC_NODE');
    const username = this.configService.get<string>('ELASTIC_USERNAME');
    const password = this.configService.get<string>('ELASTIC_PASSWORD');

    if (!node) {
      throw new Error('ELASTIC_NODE tidak ditemukan di .env');
    }

    this.client = new Client({
      node,
      auth: username && password ? { username, password } : undefined,
    });
  }

  async indexRestaurant(data: any) {
    return this.client.index({
      index: 'restaurants',
      document: data,
    });
  }

  async searchRestaurant(query: string) {
    return this.client.search({
      index: 'restaurants',
      query: {
        multi_match: {
          query,
          fields: ['name', 'address'],
        },
      },
    });
  }

  async deleteRestaurant(id: number) {
    return this.client.delete({
      index: 'restaurants',
      id: id.toString(),
    });
  }

  async search(params: any, options?: any) {
    return this.client.search(params, options);
  }

  async index(params: any, options?: any) {
    return this.client.index(params, options);
  }

  async delete(params: any, options?: any) {
    return this.client.delete(params, options);
  }

  async update(params: any) {
    return this.client.update(params);
  }

  async get(params: any) {
    return this.client.get(params);
  }

  getClient() {
    return this.client;
  }
}
