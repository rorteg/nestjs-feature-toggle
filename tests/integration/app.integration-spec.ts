import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApplicationModule } from './fixtures/app.module';

describe('AppController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return "feature is not active"', async () => {
      const response = await request(app.getHttpServer()).get('/');
      expect(response.text).toBe('feature is not active');
    });

    it('should return "feature is active"', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('feature_test_e2e', '1');
      expect(response.text).toBe('feature is active');
    });
  });

  describe('/content (GET)', () => {
    it('feature is not active with decorator', async () => {
      const response = await request(app.getHttpServer()).get('/content');
      expect(response.status).toBe(403);
    });

    it('should return "feature is active" when header is set', async () => {
      const response = await request(app.getHttpServer())
        .get('/content')
        .set('feature_test_e2e', '1');
      expect(response.text).toBe('my content');
    });
  });
});