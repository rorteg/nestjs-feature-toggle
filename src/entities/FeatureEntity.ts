import FeatureInterface from '../interfaces/feature.interface';

export class FeatureEntity implements FeatureInterface {
  private acceptHTTPRequestContext: boolean;
  private name: string;
  private value: boolean;

  isEnabled(): boolean {
    return this.value;
  }

  setAcceptHTTPRequestContext(
    acceptHTTPRequestContext: boolean
  ): FeatureEntity {
    this.acceptHTTPRequestContext = acceptHTTPRequestContext;
    return this;
  }

  isAcceptHTTPRequestContext(): boolean {
    return this.acceptHTTPRequestContext;
  }

  setName(name: string): FeatureEntity {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setValue(value: boolean): FeatureEntity {
    this.value = value;
    return this;
  }

  getValue(): boolean {
    return this.value;
  }
}
