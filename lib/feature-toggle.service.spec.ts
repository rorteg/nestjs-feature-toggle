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

  return module.get<FeatureToggleService>(FeatureToggleService);
};

const config: FeatureToggleModuleOptions = {
  dataSource: dataSourceEnum.MODULE_CONFIG,
  featureSettings: [
    {
      name: 'TEST',
      value: true
    }
  ]
 };

describe('Feature Toggle Service', () => {
  describe('Should not use Http request context', () => {
    let featureToggleService: FeatureToggleService;
    beforeAll(async () => {
      featureToggleService = await setup(config);
    });

    it('should check if a feature is enabled by the configuration', async () => {

      let feature = await featureToggleService.getFeature(config.featureSettings[0].name);
      
      expect(feature.isEnabled()).toBe(config.featureSettings[0].value);
    });
  });
});