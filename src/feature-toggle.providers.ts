import { Provider } from '@nestjs/common';
import { FeatureToggleModuleOptions } from './interfaces/feature-toggle-module-options.interface';
import { FEATURE_TOGGLE_MODULE_OPTIONS } from './feature-toggle.constants';

export function createFeatureToggleProvider(
  options: FeatureToggleModuleOptions
): Provider[] {
  return [{ provide: FEATURE_TOGGLE_MODULE_OPTIONS, useValue: options || {} }];
}
