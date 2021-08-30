import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { FeatureEntity } from "./entities/FeatureEntity";
import FeatureToggleServiceInterface from "./interfaces/feature-toggle.service.interface";

@Injectable()
export class FeatureToggleExpressMiddleware implements NestMiddleware {
  constructor(
    @Inject('FeatureToggleService') private readonly FeatureToggleService: FeatureToggleServiceInterface
  ) { }
  
  async use(req: Request, res: Response, next: NextFunction) {
    Object.keys(req.headers)
      .filter(key => key.includes('FEATURE_'))
      .forEach(async (key) => {
        const feature = await this.FeatureToggleService.getFeature(key) as FeatureEntity;

        if (!feature) {
          feature.setValue((req.headers[key] === '1' || req.headers[key] === 'true'));
        }
      });
  }
}