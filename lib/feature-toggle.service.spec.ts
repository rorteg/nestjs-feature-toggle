import { Test } from '@nestjs/testing';
import {
  dataSourceEnum,
  FeatureToggleModuleOptions
} from './interfaces/feature-toggle-module-options.interface';
import { FeatureToggleModule } from './feature-toggle.module';
import { FeatureToggleService } from './feature-toggle.service';

const setup = async (config: FeatureToggleModuleOptions) => {
  const module = await Test.createTestingModule({
    imports: [FeatureToggleModule.register(config)]
  }).compile();

  return module.resolve<FeatureToggleService>(FeatureToggleService);
};

const config: FeatureToggleModuleOptions = {
  dataSource: dataSourceEnum.MODULE_CONFIG,
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

    it('', async () => {
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
      let feature = await featureToggleService.getFeature(config.featureSettings[0].name);
      expect(feature.isEnabled()).toBe(config.featureSettings[0].value);
    });

    it('Should check if a feature is not enabled by the configuration', async () => {
      let feature = await featureToggleService.getFeature(config.featureSettings[1].name);
      expect(feature.isEnabled()).toBe(config.featureSettings[1].value);
    });
  });
});