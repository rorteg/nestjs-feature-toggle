export interface FeatureToggleDataSourceInterface {
  getFeatures(): Promise<
    {
      name: string;
      value: boolean;
    }[]
  >;
}
