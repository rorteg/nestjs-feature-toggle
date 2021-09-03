import { ExecutionContext } from '@nestjs/common';
import FeatureInterface from './feature.interface';

interface FeatureToggleServiceInterface {
  getFeature(featureName: string, context?: ExecutionContext): Promise<FeatureInterface> | null;
  isFeatureEnabled(featureName: string, context?: ExecutionContext): Promise<boolean> | null;
}

export default FeatureToggleServiceInterface;
