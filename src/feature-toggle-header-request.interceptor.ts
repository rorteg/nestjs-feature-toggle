import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeatureToggleService } from './feature-toggle.service';

@Injectable()
export class FeatureToggleHeaderRequestInterceptor implements NestInterceptor {
  constructor(private featureToggleService: FeatureToggleService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    if (!this.featureToggleService.getHttpContextConfig()?.enabled) {
      return next.handle();
    }

    const headers = context.switchToHttp().getRequest().headers;
    const features = await this.featureToggleService.getFeatures();

    if (!features?.length) {
      return next.handle();
    }

    FeatureToggleService.setFeaturesFromHeader(
      headers,
      features,
      this.featureToggleService.getHttpContextConfig()
    );

    return next.handle();
  }
}
