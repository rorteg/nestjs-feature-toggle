import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import { ApplicationModule } from './app.module';

const DEFAULT_PORT = 3000;

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    new ExpressAdapter()
  );

  app.enableShutdownHooks();
  app.set('trust proxy', true);

  await app.listen(DEFAULT_PORT);
}

void main();
