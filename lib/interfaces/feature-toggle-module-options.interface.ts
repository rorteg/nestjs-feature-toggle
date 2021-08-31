import { ModuleMetadata, Type } from "@nestjs/common";

export interface FeatureConfigInterface {
  name: string,
  value?: boolean;
  acceptHttpRequestContext?: boolean;
}

export enum DataSourceEnum {
  MODULE_CONFIG = 'MODULE_CONFIG'
}

export interface HttpRequestContext {
  keywordToBeSearchedInHeader?: string;
}

export interface FeatureToggleModuleOptions {
  dataSource?: DataSourceEnum;
  httpRequestContext?: HttpRequestContext;
  featureSettings?: FeatureConfigInterface[];
}

export interface FeatureToggleOptionsFactory {
  createFeatureTogglesOptions(): Promise<FeatureToggleModuleOptions> | FeatureToggleModuleOptions;
}

export interface FeatureToggleModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FeatureToggleOptionsFactory>;
  useClass?: Type<FeatureToggleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<FeatureToggleModuleOptions> | FeatureToggleModuleOptions;
  inject?: any[];
}