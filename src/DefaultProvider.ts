import Provider from './injections/Provider';
import AutoWireMeta from './injections/AutoWireMeta';

export class DefaultProvider implements Provider {
    // tslint:disable-next-line
    public resolve<T>(value: T, meta: AutoWireMeta, args: any[]): T {
        if (typeof meta.type === 'function') {
            return new meta.type(...(meta.constructorParams || []));
        }

        return value;
    }
}

const defaultProvider: DefaultProvider = new DefaultProvider();

export default defaultProvider;
