import FeatureInterface from "./feature.interface";

export interface FeatureToggleRepositoryInterface {
  getFeatures(): Promise<FeatureInterface[]> | null;
}