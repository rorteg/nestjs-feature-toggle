import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { FeatureEntity } from './entities/FeatureEntity';
import { FEATURE_TOGGLE_MODULE_OPTIONS } from './feature-toggle.constants';
import { FeatureToggleRepository } from './feature-toggle.repository';
import { FeatureToggleModuleOptions, HttpRequestContext } from './interfaces';
import { FeatureToggleRepositoryInterface } from './interfaces/feature-toggle.repository.interface';
import FeatureToggleServiceInterface from './interfaces/feature-toggle.service.interface';
import FeatureInterface from './interfaces/feature.interface';

@Injectable({ scope: Scope.REQUEST })
export class FeatureToggleService implements FeatureToggleServiceInterface {
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

  async getFeature(
    featureName: string,
    context?: ExecutionContext
  ): Promise<FeatureInterface> | null {
    const features = (await this.getFeatures()) ?? null;
    if (!features) return null;

    if (context) {
      const httpRequestConfig = this.getHttpContextConfig();
      const headers = context.switchToHttp().getRequest().headers;
      FeatureToggleService.setFeaturesFromHeader(
        headers,
        features,
        httpRequestConfig
      );
    }

    const foundFeature = this.features.find(
      (feature: FeatureEntity) => featureName === feature.getName()
    );

    return foundFeature;
  }

  async isFeatureEnabled(
    featureName: string,
    context?: ExecutionContext
  ): Promise<boolean> | null {
    const feature = await this.getFeature(featureName, context);
    return feature ? feature.isEnabled() : null;
  }

  getHttpContextConfig(): HttpRequestContext {
    return this.options.httpRequestContext;
  }

  static setFeaturesFromHeader<T>(
    headers: T,
    features: FeatureEntity[],
    httpRequestConfig?: HttpRequestContext
  ): void {
    const headersKeys = Object.keys(headers).filter((key) =>
      key.includes(httpRequestConfig?.keywordToBeSearchedInHeader ?? 'feature_')
    );

    const findFeatureByKey = (headersKey: string) => {
      return features.find((feature: FeatureEntity) => {
        return feature.getName().toUpperCase() === headersKey.toUpperCase();
      });
    };

    headersKeys.forEach((headersKey) => {
      const feature: FeatureEntity = findFeatureByKey(headersKey);

      if (feature?.isAcceptHTTPRequestContext()) {
        const keyValue = headers[headersKey];
        feature.setValue(!!parseInt(keyValue));
      }
    });
  }
}
