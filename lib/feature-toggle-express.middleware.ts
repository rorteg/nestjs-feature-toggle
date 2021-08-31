import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FeatureToggleService } from '.';
import { FeatureEntity } from './entities/FeatureEntity';
import FeatureToggleServiceInterface from './interfaces/feature-toggle.service.interface';

@Injectable()
export class FeatureToggleExpressMiddleware implements NestMiddleware {
  constructor(private readonly featureToggleService: FeatureToggleService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    Object.keys(req.headers)
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
          feature.setValue(!!parseInt(req.headers[key] as string));
        }
      });
    next();
  }
}
