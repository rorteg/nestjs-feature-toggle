import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeatureToggleService } from './.';
import { FeatureEntity } from './.';

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
    Object.keys(headers)
      .filter((key) =>
        key.includes(
          this.featureToggleService.getHttpContextConfig()
            ?.keywordToBeSearchedInHeader ?? 'feature_'
        )
      )
      .forEach(async (key) => {
        const feature: FeatureEntity = features.filter(
          (feature: FeatureEntity) => {
            return feature.getName() === key.toUpperCase();
          }
        )[0];

        if (
          typeof feature !== 'undefined' &&
          feature.isAcceptHTTPRequestContext()
        ) {
          feature.setValue(!!parseInt(headers[key] as string));
        }
      });

    return next.handle();
  }
}
