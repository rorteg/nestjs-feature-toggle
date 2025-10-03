import { Injectable, Logger } from '@nestjs/common';
import { FeatureEntity } from './entities/FeatureEntity';
import { FeatureToggleDataSourceFactory } from './feature-toogle.data-source.factory';
import { FeatureToggleModuleOptions } from './interfaces';
import { FeatureToggleDataSourceInterface } from './interfaces/feature-toggle.data-source.interface';
import { FeatureToggleRepositoryInterface } from './interfaces/feature-toggle.repository.interface';
import FeatureInterface from './interfaces/feature.interface';

@Injectable()
export class FeatureToggleRepository
  implements FeatureToggleRepositoryInterface
{
  private readonly dataSource: FeatureToggleDataSourceInterface;
  private readonly options: FeatureToggleModuleOptions;
  private readonly logger = new Logger('FeatureToggleRepository');

  constructor(options: FeatureToggleModuleOptions) {
    this.options = options;
    this.dataSource = new FeatureToggleDataSourceFactory(this.options).create(
      this.options.dataSource
    );
  }

  async getFeatures(): Promise<FeatureInterface[]> | null {
    const features = await this.dataSource.getFeatures();

    if (!features.length) {
      return null;
    }

    return features.map((featureData) => {
      const featureAdditionalSettings = this.options?.featureSettings
        ? this.options.featureSettings.filter((feat) => {
            return feat.name == featureData.name;
          })[0]
        : null;

      return new FeatureEntity()
        .setName(featureData.name)
        .setValue(featureData.value)
        .setAcceptHTTPRequestContext(
          featureAdditionalSettings?.acceptHttpRequestContext ?? false
        );
    }) as FeatureInterface[];
  }
}
