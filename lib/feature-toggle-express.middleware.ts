import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { FeatureEntity } from "./entities/FeatureEntity";
import FeatureToggleServiceInterface from "./interfaces/feature-toggle.service.interface";

@Injectable()
export class FeatureToggleExpressMiddleware implements NestMiddleware {
  constructor(private readonly featureToggleService: FeatureToggleServiceInterface)
  {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    Object.keys(req.headers)
      .filter((key) => key.includes('feature_'))
      .forEach(async (key) => {
        const feature = (await this.featureToggleService.getFeature(
          key.toUpperCase(),
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