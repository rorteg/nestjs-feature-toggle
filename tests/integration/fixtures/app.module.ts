import { Module, Scope } from '@nestjs/common';
import { DataSourceEnum, FeatureToggleGuard, FeatureToggleModule } from '../../../src';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    FeatureToggleModule.registerAsync({
      useFactory: () => ({
        dataSource: DataSourceEnum.MODULE_CONFIG,
        httpRequestContext: {
          enabled: true
        },
        featureSettings: [
          {
            name: 'FEATURE_TEST_E2E',
            value: false,
            acceptHttpRequestContext: true
          }
        ]
      })
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FeatureToggleGuard,
      scope: Scope.REQUEST,
    },
  ],
  controllers: [AppController]
})
export class ApplicationModule {}
