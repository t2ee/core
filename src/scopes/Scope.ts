import AutoWireMeta from '../injections/AutoWireMeta';
import Provider from '../injections/Provider';

interface Scope {
    handle<T>(value: T, providers: Provider[], meta: AutoWireMeta, args: any[]): T;
    shouldBreak(): boolean;
}

export default Scope;
