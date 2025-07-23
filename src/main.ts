import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/all-exceptions-filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docs = new DocumentBuilder()
    .setTitle('solar-api')
    .setDescription('API documentation for the solar project')
    .setVersion('1.0')
    .addTag('solar')
    .addBearerAuth({
      in: 'header',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, docs);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    Credential: true,
    origin: (origin, callback) => {
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.SERVICE_PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
