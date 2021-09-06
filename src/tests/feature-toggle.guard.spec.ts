import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureToggleGuard, FeatureToggleService } from '..';

const createContextMock = (requestData = {}) => {
  const context: ExecutionContext = {
    switchToHttp: () => context,
    getRequest: () => {
      return requestData;
    },
    getResponse: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn()
  } as unknown as ExecutionContext;
  return context;
};

describe('FeatureToggleGuard', () => {
  let guard: FeatureToggleGuard;
  let reflector: Reflector;
  let featureToggleService: FeatureToggleService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureToggleGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn()
          }
        },
        {
          provide: FeatureToggleService,
          useValue: {
            constructor: jest.fn(),
            isFeatureEnabled: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get<FeatureToggleGuard>(FeatureToggleGuard);
    featureToggleService =
      module.get<FeatureToggleService>(FeatureToggleService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if the `Feature` decorator is not set', async () => {
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => []);
    jest
      .spyOn(featureToggleService, 'isFeatureEnabled')
      .mockReturnValue(Promise.resolve(true));

    const context = createContextMock({ headers: { TEST_FEATURE: '1' } });
    const result = await guard.canActivate(context);

    expect(result).toBeTruthy();
    expect(reflector.get).toBeCalledTimes(1);
  });

  it('should return false if the `Feature` decorator is set but the feature is disable', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('TEST_FEATURE');
    jest
      .spyOn(featureToggleService, 'isFeatureEnabled')
      .mockReturnValue(Promise.resolve(false));

    const context = createContextMock({
      headers: { TEST_FEATURE: '0' }
    });

    const result = await guard.canActivate(context);
    expect(result).toBeFalsy();
    expect(reflector.get).toBeCalledTimes(1);
  });

  it('should return true if the `Feature` decorator is set but the feature is enable', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('TEST_FEATURE');
    jest
      .spyOn(featureToggleService, 'isFeatureEnabled')
      .mockReturnValue(Promise.resolve(true));

    const context = createContextMock({
      headers: { TEST_FEATURE: '0' }
    });

    const result = await guard.canActivate(context);
    expect(result).toBeTruthy();
    expect(reflector.get).toBeCalledTimes(1);
  });
});
