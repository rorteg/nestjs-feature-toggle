import FeatureInterface from "./feature.interface";

interface FeatureToggleServiceInterface {
  getFeature(featureName: string): Promise<FeatureInterface> | null;
  isFeatureEnabled(featureName: string): Promise<boolean> | null;
}

export default FeatureToggleServiceInterface;
