import { Module } from '@nestjs/common';
import { DataSourceEnum, FeatureToggleModule } from '../../src';
import { AppController } from './app.controller';

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
  controllers: [AppController]
})
export class ApplicationModule {}
