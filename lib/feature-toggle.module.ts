import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  FeatureToggleModuleAsyncOptions,
  FeatureToggleModuleOptions,
  FeatureToggleOptionsFactory
} from './interfaces';
import { FeatureToggleService } from './feature-toggle.service';
import { createFeatureToggleProvider } from './feature-toggle.providers';
import { FEATURE_TOGGLE_MODULE_OPTIONS } from './feature-toggle.constants';
import { FeatureToggleExpressMiddleware } from '.';

@Module({
  providers: [FeatureToggleService, {
    provide: FeatureToggleExpressMiddleware,
    useFactory: (FeatureToggleService: FeatureToggleService) => {
      return new FeatureToggleExpressMiddleware(FeatureToggleService);
    },
    inject: [FeatureToggleService]
  }],
  exports:[FeatureToggleService, FeatureToggleExpressMiddleware]
})
  
export class FeatureToggleModule {
  static register(options: FeatureToggleModuleOptions): DynamicModule {
    return {
      module: FeatureToggleModule,
      providers: createFeatureToggleProvider(options)
    }
  }

  static registerAsync(options: FeatureToggleModuleAsyncOptions): DynamicModule {
    return {
      module: FeatureToggleModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options)
    };
  }

  private static createAsyncProviders(
    options: FeatureToggleModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(
    options: FeatureToggleModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FEATURE_TOGGLE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }
    return {
      provide: FEATURE_TOGGLE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FeatureToggleOptionsFactory) =>
        await optionsFactory.createFeatureTogglesOptions(),
      inject: [options.useExisting || options.useClass]
    };
  }
}