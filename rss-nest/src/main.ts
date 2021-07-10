import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, USE_FASTIFY } from './common/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  console.log(USE_FASTIFY);

  var app;
  if (USE_FASTIFY === 'true') {
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
  } else {
    app = await NestFactory.create(AppModule);
  }

  const config = new DocumentBuilder()
    .setTitle('NEST_APP')
    .setDescription('RSS Nestjs app')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/doc', app, document);

  await app.listen(PORT);
  console.log(
    `${
      USE_FASTIFY === 'true' ? 'Fastify' : 'Express'
    } App is running on localhost:${PORT}`,
  );
}
bootstrap();
