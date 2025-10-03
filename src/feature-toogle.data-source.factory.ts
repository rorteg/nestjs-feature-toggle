import { FeatureToggleConfigDataSource } from './dataSources/feature-toggle-config.data-source';
import { DataSourceEnum, FeatureToggleModuleOptions } from './interfaces';

export class FeatureToggleDataSourceFactory {
  private readonly options: FeatureToggleModuleOptions;

  constructor(options: FeatureToggleModuleOptions) {
    this.options = options;
  }
  create(dataSourceType: DataSourceEnum) {
    switch (dataSourceType) {
      case DataSourceEnum.MODULE_CONFIG:
        return new FeatureToggleConfigDataSource(this.options);
    }
  }
}
