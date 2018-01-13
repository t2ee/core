import AutoWireMeta from './AutoWireMeta';

interface Provider {
    resolve<T>(value: T, type:  (new (...args: any[]) => any) | Symbol | string, declaredType:  new (...args: any[]) => any, data: any): T;
}

export default Provider;
