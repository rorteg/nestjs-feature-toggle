import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeatureToggleService } from './feature-toggle.service';
import { FeatureEntity } from './entities';

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
    Object.keys(headers)
      .filter((key) =>
        key.includes(
          this.featureToggleService.getHttpContextConfig()
            ?.keywordToBeSearchedInHeader ?? 'feature_'
        )
      )
      .forEach(async (key) => {
        const feature = (await this.featureToggleService.getFeature(
          key.toUpperCase()
        )) as FeatureEntity;

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