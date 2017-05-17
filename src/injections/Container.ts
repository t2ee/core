import ClassConstructor from '../ClassConstructor';
import Provider from './Provider';
import AutoWireMeta from './AutoWireMeta';
import ComponentMeta from './ComponentMeta';
import Scope from '../scopes/Scope';

class ClassProxy<T extends Object> implements ProxyHandler<T> {

    public constructor(
        private parameters: {[key: string]: {[index: number]: AutoWireMeta}},
        private data: any,
    ) {
    }

    public get(target: T, key: PropertyKey, receiver: any): any {
        if (key in this.parameters) { // this is a function
            const metas: {[index: number]: AutoWireMeta} = this.parameters[key];
            const method: Function = target[key];
            const passInData: any = this.data;

            return function (...params: any[]): any {
                for (const index in metas) {
                    const wire: AutoWireMeta = metas[index];
                    params[index] = Container.get(wire.type, wire.declaredType, wire.data, passInData);
                }

                return method.apply(this, params);
            };
        }

        return target[key];
    }
}

class Container {
    private static components:
        Map<string | Symbol | ClassConstructor<any>, {providers: Set<Provider>, meta: ComponentMeta}> =
        new Map<string | Symbol | ClassConstructor<any>, {providers: Set<Provider>, meta: ComponentMeta}>();
    private static providers: Map<string | Symbol | ClassConstructor<any>, Set<Provider>> =
        new Map<string | Symbol | ClassConstructor<any>, Set<Provider>>();

    public static get<T>(
        type: ClassConstructor<T> | Symbol | string,
        declaredType: ClassConstructor<T>,
        data?: any,
        ...params: any[],
    ): T;
    public static get<T>(
        type: ClassConstructor<T> | Symbol | string,
        data?: any,
        ...params: any[],
    ): T;
    public static get<T>(
        type: ClassConstructor<T> | Symbol | string,
        declaredTypeOrData: ClassConstructor<T> | any,
        dataOrParam?: any,
        ...params: any[],
    ): T {
        const item: {providers: Set<Provider>, meta: ComponentMeta} = Container.components.get(type);
        let declaredType: ClassConstructor<any> = null;
        let data: any = null;

        if (typeof declaredTypeOrData === 'function') {
            declaredType = declaredTypeOrData;
            data = dataOrParam;
        } else {
            data = declaredTypeOrData;
            params.unshift(dataOrParam);
        }

        let meta: ComponentMeta = null;
        let providers: Set<Provider> = new Set<Provider>();
        let scopes: Scope[] = [];

        if (item) {
            meta = item.meta;
            providers = item.providers;
            scopes = item.meta.scope;
        }

        let instance: T = null;

        if (Container.providers.get(type)) {
            for (const provider of Container.providers.get(type)) {
                providers.add(provider);
            }
        }

        if (!providers) {
            throw new Error(`${(type as Function).name || type.toString()} is not a Component`);
        }

        if (meta) {
            for (const index in meta.argument) {
                const wire: AutoWireMeta = meta.argument[index];
                params[index] = Container.get(wire.type, wire.declaredType, wire.data, data);
            }
        }


        if (scopes.length) {
            for (const scope of scopes) {
                instance = scope.handle(instance, Array.from(providers), {type, data, declaredType}, params);
                if (scope.shouldBreak()) {
                    break;
                }
            }
        } else {
            for (const provider of providers) {
                instance = provider.resolve(instance, { type, data, declaredType }, params);
            }
        }

        if (meta) {
            for (const key in meta.property) {
                const wire: AutoWireMeta = meta.property[key];
                instance[key] = Container.get(wire.type, wire.declaredType, wire.data, data);
                if (instance[key] === null) {
                    instance[key] = Container.get(key, wire.declaredType, wire.data, data);
                }
            }

            if (instance === null) {
                return null;
            }

            return new Proxy<T>(instance, new ClassProxy<T>(meta.parameter, data));
        } else {
            return instance;
        }
    }

    public static inject(
        type: string | Symbol | ClassConstructor<any>,
        provider: Provider,
        meta?: ComponentMeta,
    ): void {
        if (meta) {
            let item: {providers: Set<Provider>, meta: ComponentMeta}  = Container.components.get(type);
            if (!item) {
                item = {
                    providers: new Set<Provider>(),
                    meta,
                };
            }
            item.providers.add(provider);
            Container.components.set(type, item);
        } else {
            const providers: Set<Provider> = Container.providers.get(type) || new Set<Provider>();
            providers.add(provider);
            Container.providers.set(type, providers);
        }
    }

}

export default Container;
