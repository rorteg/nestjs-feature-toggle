import { Reflector } from '@nestjs/core';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { FeatureToggleGuard } from '../guards/feature-toggle.guard';
import {
  FeatureEnabled,
  FEATURE_TOGGLE_DECORATOR_KEY
} from '../decorators/feature-toggle.decorator';
import { FeatureToggleService } from '..';
import { Test, TestingModule } from '@nestjs/testing';

class MyType {}

describe('@FeatureEnabled()', () => {
  test('FeatureEnabled()', () => {
    FeatureEnabled('myToggleName')(MyType);

    expect(new Reflector().get(FEATURE_TOGGLE_DECORATOR_KEY, MyType)).toBe(
      'myToggleName'
    );
  });
});

describe('IfFeatureToggleGuard', () => {
  let guard: FeatureToggleGuard;
  let context: ExecutionContext;
  let service: jest.Mocked<FeatureToggleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureToggleGuard,
        {
          provide: FeatureToggleService,
          useValue: { isFeatureEnabled: jest.fn() }
        }
      ]
    }).compile();

    guard = module.get(FeatureToggleGuard);
    service = module.get(FeatureToggleService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context = { getHandler: jest.fn().mockReturnValue(MyType) };
  });

  it('passes if feature is enabled', async () => {
    service.isFeatureEnabled.mockReturnValue(Promise.resolve(true));

    expect(guard.canActivate(context)).toBeTruthy();
  });
});
