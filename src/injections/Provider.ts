import AutoWireMeta from './AutoWireMeta';

interface Provider {
    resolve<T>(value: T, meta: AutoWireMeta, args: any[]): T;
}

export default Provider;
