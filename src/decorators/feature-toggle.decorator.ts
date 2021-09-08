import { SetMetadata } from '@nestjs/common';

export const FEATURE_TOGGLE_DECORATOR_KEY = 'FEATURE_TOGGLE';
export const FeatureEnabled = (permissions: string) =>
  SetMetadata(FEATURE_TOGGLE_DECORATOR_KEY, permissions);
