import FeatureInterface from '../interfaces/feature.interface';

export class FeatureEntity implements FeatureInterface {
  private acceptHTTPRequestContext: boolean;
  private name: string;
  private value: boolean;

  isEnabled(): boolean {
    return this.value;
  }

  setAcceptHTTPRequestContext(acceptHTTPRequestContext: boolean): this {
    this.acceptHTTPRequestContext = acceptHTTPRequestContext;
    return this;
  }

  isAcceptHTTPRequestContext(): boolean {
    return this.acceptHTTPRequestContext;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setValue(value: boolean): this {
    this.value = value;
    return this;
  }

  getValue(): boolean {
    return this.value;
  }
}
