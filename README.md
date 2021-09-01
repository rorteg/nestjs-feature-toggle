<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/v/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/l/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@rafaelortegabueno/nestjs-feature-toggle" target="_blank"><img src="https://img.shields.io/npm/dm/@rafaelortegabueno/nestjs-feature-toggle.svg" alt="NPM Downloads" /></a>

[![codecov](https://codecov.io/gh/rorteg/nestjs-feature-toggle/branch/master/graph/badge.svg?token=yZ3N9q9p5L)](https://codecov.io/gh/rorteg/nestjs-feature-toggle)

## Description

Dynamic NestJS module that provides facilities in working with [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html).

This module was built in order to facilitate the implementation of feature management tools without compromising their use in projects.

## Features

- Feature Toggles settings via module configuration
- Possibility of enabling features via HTTP request header

## Installation

```bash
$ npm i --save @rafaelortegabueno/nestjs-feature-toggle
```

## Quick Start

Register the Module settings in your application:

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

To work with a new feature, just add it in the settings:

```typescript
// app.module.ts

featureSettings: [{
  {
    name: 'FEATURE_TEST',
    value: false
  }
}]
```

In the implementation of your feature, just inject the FeatureToggleService in your constructor and use the "isFeatureEnabled()" method.

```typescript
export class Class {
  constructor(
    private readonly featureToggleService: FeatureToggleService
  ) {}

  async method() {
    if(await this.featureToggleService.isFeatureEnabled('FEATURE_TEST')) {
      return 'FEATURE TEST IMPLEMENTED!'
    }

    return 'FEATURE TEST NOT IMPLEMENTED!';
  }
}
```

---

## Enabling features via HTTP request header

You might want to test a feature in production without affecting the environment. For this, the possibility of enabling a feature through HTTP request headers was implemented.

*Note: This feature is disabled by default, as it uses a request interceptor which can cause a small performance loss.*

To enable it, add the configuration in your application:

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
          name: 'FEATURE_TEST',
          value: false,
          acceptHttpRequestContext: true,
        }
      ]
    })
  ]
})
```

Note that it is necessary to enable the functionality so that it is possible to process the configured features, but it is necessary to specify in each feature whether it is allowed to change it via HTTP request.

To enable the FEATURE_TEST feature via request, just send in the header:

```text
feature_test = 1
```

The value sent in the header will overwrite the configured value and will be valid only for the request in question.

*Note: the interceptor searches by default for the string 'feature_' in the header keys.*

It is possible to configure a custom string:

```typescript
// app.module.ts

httpRequestContext: {
  enabled: true,
  keywordToBeSearchedInHeader: 'feature_',
}
```

---

## License

[MIT licensed](LICENSE).