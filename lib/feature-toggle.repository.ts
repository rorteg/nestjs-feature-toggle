import { Injectable, Logger } from "@nestjs/common";
import { FeatureEntity } from "./entities/FeatureEntity";
import { FeatureToggleDataSourceFactory } from "./feature-toogle.data-source.factory";
import { FeatureToggleModuleOptions } from "./interfaces";
import { FeatureToggleDataSourceInterface } from "./interfaces/feature-toggle.datasource.interface";
import { FeatureToggleRepositoryInterface } from "./interfaces/feature-toggle.repository.interface";
import FeatureInterface from "./interfaces/feature.interface";

@Injectable()
export class FeatureToggleRepository implements FeatureToggleRepositoryInterface {
  private dataSource: FeatureToggleDataSourceInterface;
  private options: FeatureToggleModuleOptions;
  private readonly logger = new Logger('FeatureToggleRepository');

  constructor(
    options: FeatureToggleModuleOptions,
  ) {
    this.options = options;
    this.dataSource = new FeatureToggleDataSourceFactory(this.options)
      .create(this.options.dataSource);
  }
  

  async getFeatures(): Promise<FeatureInterface[]> | null {
    let features = await this.dataSource.getFeatures();

    if (!features.length) {
      return null;
    }

    return features.map((featureData) => {
      return (new FeatureEntity())
        .setName(featureData.name)
        .setValue(featureData.value);
    }) as FeatureInterface[];
  }

}
