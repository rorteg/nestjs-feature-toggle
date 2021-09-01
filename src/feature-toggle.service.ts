import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { FeatureEntity } from './entities/FeatureEntity';
import { FEATURE_TOGGLE_MODULE_OPTIONS } from './feature-toggle.constants';
import { FeatureToggleRepository } from './feature-toggle.repository';
import { FeatureToggleModuleOptions, HttpRequestContext } from './interfaces';
import { FeatureToggleRepositoryInterface } from './interfaces/feature-toggle.repository.interface';
import FeatureToggleServiceInterface from './interfaces/feature-toggle.service.interface';
import FeatureInterface from './interfaces/feature.interface';

@Injectable({ scope: Scope.REQUEST })
export class FeatureToggleService implements FeatureToggleServiceInterface {
  private readonly logger = new Logger('FeatureToggleService');
  private features: FeatureEntity[] | null;
  private repository: FeatureToggleRepositoryInterface;

  constructor(
    @Inject(FEATURE_TOGGLE_MODULE_OPTIONS)
    private readonly options: FeatureToggleModuleOptions
  ) {
    this.repository = new FeatureToggleRepository(this.options);
  }

  async getFeatures(): Promise<FeatureEntity[]> | null {
    if (!this.features) {
      this.features = (await this.repository.getFeatures()) as FeatureEntity[];
    }

    return this.features;
  }

  setFeatures(features: FeatureEntity[]): FeatureToggleService {
    this.features = features;
    return this;
  }

  async getFeature(featureName: string): Promise<FeatureInterface> | null {
    const features = await this.getFeatures();
    return features?.length
      ? this.features.filter(
          (feature: FeatureEntity) => featureName === feature.getName()
        )[0]
      : null;
  }

  async isFeatureEnabled(featureName: string): Promise<boolean> | null {
    return (await this.getFeature(featureName))
      ? (await this.getFeature(featureName)).isEnabled()
      : null;
  }

  getHttpContextConfig(): HttpRequestContext {
    return this.options.httpRequestContext;
  }
}
