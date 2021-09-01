import { Test, TestingModule } from '@nestjs/testing';
import { FeatureToggleHeaderRequestInterceptor } from '../feature-toggle-header-request.interceptor';
import { FeatureToggleService } from '../feature-toggle.service';
import { ExecutionContext, Scope } from '@nestjs/common';
import { DataSourceEnum } from '../interfaces';

const executionContext: ExecutionContext = {
  switchToHttp: jest.fn(() => ({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        feature_test: '1'
      }
    }),
    getNext: jest.fn().mockReturnThis(),
    getResponse: jest.fn().mockReturnThis()
  })),
  getClass: jest.fn().mockReturnThis(),
  getHandler: jest.fn().mockReturnThis(),
  getArgs: jest.fn().mockReturnThis(),
  getArgByIndex: jest.fn().mockReturnThis(),
  switchToRpc: jest.fn().mockReturnThis(),
  switchToWs: jest.fn().mockReturnThis(),
  getType: jest.fn().mockReturnThis()
};

const callHandler = {
  handle: jest.fn()
};

describe('FeatureToggleHeaderRequestInterceptor', () => {
  let app: TestingModule;
  let featureToggleHeaderRequestInterceptor: FeatureToggleHeaderRequestInterceptor;
  let featureToggleService: FeatureToggleService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: FeatureToggleService,
          useFactory: () => {
            return new FeatureToggleService({
              dataSource: DataSourceEnum.MODULE_CONFIG,
              httpRequestContext: {
                enabled: true,
                keywordToBeSearchedInHeader: 'feature_'
              },
              featureSettings: []
            });
          },
          scope: Scope.REQUEST
        },
        {
          provide: FeatureToggleHeaderRequestInterceptor,
          useClass: FeatureToggleHeaderRequestInterceptor,
          scope: Scope.REQUEST
        }
      ]
    }).compile();

    featureToggleHeaderRequestInterceptor =
      await app.resolve<FeatureToggleHeaderRequestInterceptor>(
        FeatureToggleHeaderRequestInterceptor
      );

    /* featureToggleService = new FeatureToggleService({
      dataSource: DataSourceEnum.MODULE_CONFIG,
      httpRequestContext: {
        enabled: true,
        keywordToBeSearchedInHeader: 'feature_'
      },
      featureSettings: [
        {
          name: 'FEATURE_TEST',
          value: false,
          acceptHttpRequestContext: true
        }
      ]
    });

    featureToggleHeaderRequestInterceptor = new FeatureToggleHeaderRequestInterceptor(featureToggleService);   */
  });
  it('should be defined', () => {
    expect(featureToggleHeaderRequestInterceptor).toBeDefined();
  });
  describe('#intercept', () => {
    it('Should check the feature_test header and set true for the feature object', async () => {
      featureToggleService = new FeatureToggleService({
        dataSource: DataSourceEnum.MODULE_CONFIG,
        httpRequestContext: {
          enabled: true,
          keywordToBeSearchedInHeader: 'feature_'
        },
        featureSettings: [
          {
            name: 'FEATURE_TEST',
            value: false,
            acceptHttpRequestContext: true
          }
        ]
      });

      featureToggleHeaderRequestInterceptor =
        new FeatureToggleHeaderRequestInterceptor(featureToggleService);
      callHandler.handle.mockReturnValueOnce('next handler');
      const actualValue = await featureToggleHeaderRequestInterceptor.intercept(
        executionContext,
        callHandler
      );
      expect(actualValue).toBe('next handler');
      expect(await featureToggleService.isFeatureEnabled('FEATURE_TEST')).toBe(
        true
      );
    });
  });
});
