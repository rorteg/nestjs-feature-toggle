import { Test } from '@nestjs/testing';
import {
  DataSourceEnum,
  FeatureToggleModuleOptions
} from '../interfaces/feature-toggle-module-options.interface';
import { FeatureToggleModule } from '../feature-toggle.module';
import { FeatureToggleService } from '../feature-toggle.service';

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
  });
});
