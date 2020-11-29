import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const options: Omit<
    OpenAPIObject,
    'components' | 'paths'
  > = new DocumentBuilder()
    .setTitle('Restaurant management API')
    .setDescription('The restaurant management API description')
    .setVersion('1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  const metadata: MetadataStorage = getFromContainer(MetadataStorage);
  document.components.schemas = Object.assign(
    {},
    document.components.schemas || {},
    validationMetadatasToSchemas((metadata as any).validationMetadatas),
  );

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
