import { FeatureToggleModuleOptions } from "../interfaces";
import { FeatureToggleDataSourceInterface } from "../interfaces/feature-toggle.data-source.interface";

export class FeatureToggleConfigDataSource implements FeatureToggleDataSourceInterface {
  private options: FeatureToggleModuleOptions;

  constructor(options: FeatureToggleModuleOptions) {
    this.options = options;
  }

  async getFeatures(): Promise<{ name: string; value: boolean; }[]> {
    const featureData: { name: string; value: boolean; }[] = this.options.featureSettings?.map((featureData) => {
      return {
        name: featureData.name,
        value: featureData.value
      }
    }) || [];

    return await new Promise(resolve => resolve(featureData));
  }
}