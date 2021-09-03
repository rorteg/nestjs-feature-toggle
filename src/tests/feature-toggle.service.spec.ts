import { Test } from '@nestjs/testing';
import {
  DataSourceEnum,
  FeatureToggleModuleOptions
} from '../interfaces/feature-toggle-module-options.interface';
import { FeatureToggleModule } from '../feature-toggle.module';
import { FeatureToggleService } from '../feature-toggle.service';
import { ExecutionContext } from '@nestjs/common';

const setup = async (config: FeatureToggleModuleOptions) => {
  const module = await Test.createTestingModule({
    imports: [FeatureToggleModule.register(config)]
  }).compile();

  return module.resolve<FeatureToggleService>(FeatureToggleService);
};

const config: FeatureToggleModuleOptions = {
  dataSource: DataSourceEnum.MODULE_CONFIG,
  httpRequestContext: {
    keywordToBeSearchedInHeader: 'feature_',
    enabled: true
  },
  featureSettings: [
    {
      name: 'TEST',
      value: true
    },
    {
      name: 'TEST2',
      value: false
    }
  ]
};

const executionContext: ExecutionContext = {
  switchToHttp: jest.fn(() => ({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        [config.featureSettings[0].name]: '1'
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

describe('Feature Toggle Service', () => {
  describe('If the feature is not configured, it should not throw exceptions', () => {
    let featureToggleService: FeatureToggleService;
    beforeAll(async () => {
      featureToggleService = await setup(config);
    });

    it('should be defined', () => {
      expect(featureToggleService).toBeDefined();
    });

    it('Should not break if the feature does not exist', async () => {
      let feature = await featureToggleService.getFeature('NOT_EXISTS');
      expect(feature).toBeUndefined();
    });
  });

  describe('Should not use Http request context', () => {
    let featureToggleService: FeatureToggleService;
    beforeAll(async () => {
      featureToggleService = await setup(config);
    });

    it('Should check if a feature is enabled by the configuration', async () => {
      let feature = await featureToggleService.getFeature(
        config.featureSettings[0].name
      );
      expect(feature.isEnabled()).toBe(config.featureSettings[0].value);
    });

    it('Should check if a feature is not enabled by the configuration', async () => {
      let feature = await featureToggleService.getFeature(
        config.featureSettings[1].name
      );
      expect(feature.isEnabled()).toBe(config.featureSettings[1].value);
    });

    it('Should return the value of HttpRequestContext settings', () => {
      expect(
        featureToggleService.getHttpContextConfig()?.keywordToBeSearchedInHeader
      ).toBe(config.httpRequestContext.keywordToBeSearchedInHeader);
    });

    it('Should check if a feature is enabled by the configuration and context', async () => {
      let feature = await featureToggleService.getFeature(
        config.featureSettings[0].name,
        executionContext
      );
      expect(feature.isEnabled()).toBeTruthy()
    });
  });
});
