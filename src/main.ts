import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// IMPORT SWAGGER
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIG SWAGGER
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Dokumentasi API NestJS')
    .setVersion('1.0')
    .addBearerAuth() // jika pakai JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);

  // RESPONSE FORMAT SUCCESS
  app.useGlobalInterceptors(new TransformInterceptor());

  // RESPONSE FORMAT ERROR
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
