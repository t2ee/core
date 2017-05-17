import AutoWireMeta from '../injections/AutoWireMeta';
import Scope from './Scope';
import Provider from '../injections/Provider';

export default class SingletonScope implements Scope {
    private instance: any = null;

    public handle<T>(value: T, providers: Provider[], meta: AutoWireMeta, args: any[]): T {
        if (this.instance) {
            return this.instance;
        } else {
            for (const provider of providers) {
                value = provider.resolve(value, meta, args);
            }
            this.instance = value;

            return value;
        }
    }

    public shouldBreak(): boolean {
        if (this.instance) {
            return true;
        }

        return false;
    }
}
