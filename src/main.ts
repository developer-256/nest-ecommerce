import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as cookieParser from 'cookie-parser';
import { CookieName } from './modules/auth/enums/cookie_name.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Nest JS')
    .setDescription('Ecommerce Nest JS api')
    .setVersion('1.0')
    .addCookieAuth(CookieName.Refresh)
    .addCookieAuth(CookieName.Authentication)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(Number.parseInt(process.env.APP_LISTEN_PORT) ?? 3000);
}
bootstrap();
