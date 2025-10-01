import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_TOGGLE_DECORATOR_KEY } from '../decorators/feature-toggle.decorator';
import { FeatureToggleService } from '../feature-toggle.service';

@Injectable()
export class FeatureToggleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private featureToggleService: FeatureToggleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureKey = this.reflector.get<string>(
      FEATURE_TOGGLE_DECORATOR_KEY,
      context.getHandler()
    );
    if (!featureKey) {
      return true;
    }
    return await this.featureToggleService.isFeatureEnabled(
      featureKey,
      context
    );
  }
}
