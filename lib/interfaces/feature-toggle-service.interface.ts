import Feature from "./feature.interface";

interface FeatureToggleService {
  getFeature(featureName: string): Feature;
  isFeatureEnabled(featureName: string): boolean;
}

export default FeatureToggleService;
