import { Controller, Get } from '@nestjs/common';
import { FeatureEnabled, FeatureToggleService } from '../../src';

@Controller()
export class AppController {
  constructor(private readonly featureToggleService: FeatureToggleService) {}

  @Get('/')
  async index(): Promise<string> {
    return (await this.featureToggleService.isFeatureEnabled(
      'FEATURE_TEST_E2E'
    ))
      ? 'feature is active'
      : 'feature is not active';
  }

  @FeatureEnabled('FEATURE_TEST_E2E')
  @Get('/content')
  getContent(): string {
    return 'my content';
  }
}
