import { Test, TestingModule } from '@nestjs/testing';
import { FeatureToggleHeaderRequestInterceptor } from './feature-toggle-header-request.interceptor';
import { FEATURE_TOGGLE_MODULE_OPTIONS } from './feature-toggle.constants';
import { FeatureToggleService } from './feature-toggle.service';

describe('FeatureToggleHeaderRequestInterceptor', () => {
  let app: TestingModule;
  let featureToggleHeaderRequestInterceptor: FeatureToggleHeaderRequestInterceptor;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: FeatureToggleService,
          useClass: FeatureToggleService
        },
        {
          provide: FeatureToggleHeaderRequestInterceptor,
          useClass: FeatureToggleHeaderRequestInterceptor
        },
        {
          provide: FEATURE_TOGGLE_MODULE_OPTIONS,
          useValue: {}
        }
      ]
    }).compile();

    featureToggleHeaderRequestInterceptor =
      app.get<FeatureToggleHeaderRequestInterceptor>(
        FeatureToggleHeaderRequestInterceptor
      );
  });
  it('should be defined', () => {
    expect(featureToggleHeaderRequestInterceptor).toBeDefined();
  });
});
