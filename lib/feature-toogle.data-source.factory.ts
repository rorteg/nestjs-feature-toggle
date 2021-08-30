import { FeatureToggleConfigDataSource } from "./dataSources/feature-toggle-config.data-source";
import { dataSourceEnum, FeatureToggleModuleOptions } from "./interfaces";

export class FeatureToggleDataSourceFactory {
  private options: FeatureToggleModuleOptions;

  constructor(options: FeatureToggleModuleOptions)
  {
    this.options = options;
  }
  create(dataSourceType: dataSourceEnum) {
    switch (dataSourceType) {
      case dataSourceEnum.MODULE_CONFIG:
        return new FeatureToggleConfigDataSource(this.options);
    }
  }
}
