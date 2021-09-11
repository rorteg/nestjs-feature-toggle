# NestJS Feature Toggle

Dynamic NestJS module to work with [feature toggles](https://martinfowler.com/articles/feature-toggles.html) with ease.

<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/v/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/l/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/dm/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="NPM Downloads" /></a> [![codecov](https://codecov.io/gh/rorteg/nestjs-feature-toggle/branch/master/graph/badge.svg?token=yZ3N9q9p5L)](https://codecov.io/gh/rorteg/nestjs-feature-toggle)

## Features

- Create and configure feature toggles via module configuration;
- Enable and disable feature toggles in a single HTTP request using its headers;
- Use your feature toggles by injecting a provider or via TypeScript Decorators.

## Installation

```bash
$ npm i --save @rafaelortegabueno/nestjs-feature-toggle
```

## Quick Start

Import and configure the module in your application:

```typescript
// app.module.ts
import {
  DataSourceEnum,
  FeatureToggleModule,
} from '@rafaelortegabueno/nestjs-feature-toggle';

@Module({
  imports: [
    FeatureToggleModule.register({
      dataSource: DataSourceEnum.MODULE_CONFIG,
      featureSettings: []
    })
  ]
})
```

Add your feature toggles to the `featureSettings` array:

```typescript
// app.module.ts

featureSettings: [
  {
    name: 'YOUR_FEATURE_TOGGLE',
    value: false
  }
]
```

Inject the `FeatureToggleService` in your class constructor and use `isFeatureEnabled()` 
to assert the value of your feature togggles.

```typescript
// class.ts
export class Class {
  constructor(
    private readonly featureToggleService: FeatureToggleService
  ) {}

  async method(): Promise<string> {
    if (await this.featureToggleService.isFeatureEnabled('YOUR_FEATURE_TOGGLE')) {
      return 'YOUR_FEATURE_TOGGLE is enabled!'
    }
    
    return 'YOUR_FEATURE_TOGGLE is disabled!';
  }
}
```
---
## Request scoped feature toggles

Request scoped feature toggles allows testing a new feature without changing environment variables or 
modifying the `featureSettings` array, so we don't need to deploy the application in order to enable or disable a feature toggle.

>Notice: Request scoped feature toggles are disabled by default. It uses the request interceptor, which can cause a small performance loss.

To enable request scoped feature toggles, add the following configuration in your module seetings:

```typescript
// app.module.ts

@Module({
  imports: [
    FeatureToggleModule.register({
      dataSource: DataSourceEnum.MODULE_CONFIG,
      httpRequestContext: {
        enabled: true,
      },
      featureSettings: [
        {
          name: 'YOUR_FEATURE_TOGGLE',
          value: false,
          acceptHttpRequestContext: true,
        }
      ]
    })
  ]
})
```
> Notice: It is necessary to set `acceptHttpRequestContext` to `true` in each request scoped feature toggle.

### Enable/disable a request scoped feature toggle 
Add the feature toggle to the headers section of your request with the `feature_` prefix:
```text
feature_YOUR_FEATURE_TOGGLE = 1
```

The feature toggle values sent in the headers section will overwrite the previously configured values (at the module settings) only in the
current request. Any other requests (without the headers keys) are going to use the module settings values.

> Notice: The request interceptor searches for the string `feature_` by default. However, it is possible to set a custom
> prefix.

To set a custom feature toggle prefix, add the following configuration to the `httpRequestContext` key:

```typescript
// app.module.ts

httpRequestContext: {
  enabled: true,
  keywordToBeSearchedInHeader: 'custom_prefix_',
}
```
---

## Enable/disable feature toggles with TypeScript Decorators

It is also possible to use TypeScript Decorators to enable/disable feature toggles without 
injecting the `FeatureToggleService` provider. It is specially useful to enabling/disabling access to a whole endpoint, for instance.

To do so, add the `FeatureToggleGuard` to your module configuration:
```typescript
// app.module.ts

@Module({
  imports: [
    FeatureToggleModule.register({
      dataSource: DataSourceEnum.MODULE_CONFIG,
      featureSettings: [
        {
          name: 'ALLOW_CAT_CREATION',
          value: true,
        }
      ]
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FeatureToggleGuard,
    },
  ],
})
```
Then use the `FeatureEnabled` decorator to assert the feature toggle value.

```typescript
// cat.controller.ts

@Post()
@FeatureEnabled('ALLOW_CAT_CREATION')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```
---
## License

[MIT licensed](LICENSE).
