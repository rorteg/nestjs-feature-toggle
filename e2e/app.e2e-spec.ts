import { NotFoundException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import axios, { AxiosInstance } from 'axios';
import { ApplicationModule } from './src/app.module';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let http: AxiosInstance;

  beforeEach(async () => {
    app = await NestFactory.create<NestExpressApplication>(
      ApplicationModule,
      new ExpressAdapter(),
      { logger: ['debug'], abortOnError: false }
    );

    app.enableShutdownHooks();

    await app.init();

    await app.listen('3000', '127.0.0.1');

    http = axios.create({ baseURL: await app.getUrl() });
  });

  afterEach(async () => {
    app.close();
  });

  describe('/ (GET)', () => {
    test('feature is not active', async () => {
      const response = await http.get('/');
      expect(response.data).toMatchInlineSnapshot(`"feature is not active"`);
    });

    test('feature is active', async () => {
      const response = await http.get('/', {
        headers: { feature_test_e2e: 1 }
      });
      expect(response.data).toMatchInlineSnapshot(`"feature is active"`);
    });
  });

  describe('/content (GET)', () => {
    test('feature is not active with decorator', async () => {
      try {
        await http.get('/content');
      } catch (e) {
        expect(e.message).toBe('Request failed with status code 404');
      }
    });

    test('feature is active with decorator', async () => {
      const response = await http.get('/', {
        headers: { feature_test_e2e: 1 }
      });
      expect(response.data).toBe('feature is active');
    });
  });
});
