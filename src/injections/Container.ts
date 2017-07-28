import ClassConstructor from '../ClassConstructor';
import Provider from './Provider';
import AutoWireMeta from './AutoWireMeta';
import ComponentMeta from './ComponentMeta';
import Scope from '../scopes/Scope';

class ClassProxy<T extends Object> implements ProxyHandler<T> {

    public constructor(
        private parameters: {[key: string]: {[index: number]: AutoWireMeta[]}},
        private wire: AutoWireMeta,
    ) {
    }

    public get(target: T, key: PropertyKey, receiver: any): any {
        if (key in this.parameters) { // this is a function
            const metas: {[index: number]: AutoWireMeta[]} = this.parameters[key];
            const method: Function = target[key];
            const passInData: any = this.wire.data;

            return function (...params: any[]): any {
                for (const index in metas) {
                    for (const wire of metas[index]) {
                        params[index] = Container.get(wire, params[index], passInData);
                    }
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

    public static get<T extends Object>(wire: AutoWireMeta, defaultValue?: T, ...params: any[]): T;
    public static get<T extends Object>(identifier: ClassConstructor<T> | Symbol | string, defaultValue?: T, ...params: any[]): T;
    public static get<T extends Object>(identifierOrWire: AutoWireMeta | ClassConstructor<T> | Symbol | string, defaultValue?: T, ...params: any[]): T {
        let identifier: ClassConstructor<T> | Symbol | string = null;
        let wire: AutoWireMeta = null;

        if (~['function', 'symbol', 'string'].indexOf(typeof identifierOrWire)) { // identifier
            identifier = identifierOrWire as any;
            if (typeof identifierOrWire === 'function') {
                wire = {
                    type: identifierOrWire,
                    declaredType: identifierOrWire,
                }
            } else {
                wire = {
                    type: identifierOrWire as any,
                    declaredType: null,
                }
            }
        } else {
            wire = identifierOrWire as AutoWireMeta;
            identifier = wire.type;
        }


        const target = Container.components.get(identifier);
        const providers = new Set<Provider>();
        const scopes = new Set<Scope>();

        if (target && target.providers) {
            for (const provider of target.providers) {
                providers.add(provider);
            }
        }

        for (const provider of (Container.providers.get(identifier) || [])) {
            providers.add(provider);
        }

        let instance: T = defaultValue;
        params = params || [];

        if (target && target.meta) {
            for (const index in (target.meta.argument || {})) {
                for (const wire of target.meta.argument[index]) {
                    params[index] = Container.get(wire, params[index]);
                }
            }
        }

        if (target && target.meta.scope && target.meta.scope.length) {
            for (const scope of (target.meta.scope || [])) {
                instance = scope.handle(instance, Array.from(providers), wire, params);
                if (scope.shouldBreak()) {
                    break;
                }
            }
        } else {
            for (const provider of providers) {
                instance = provider.resolve(instance, wire, params);
            }
        }

        if (target && target.meta.property) {
            for (const key in (target.meta.property || {})) {
                for (const wire of target.meta.property[key]) {
                    instance[key] = Container.get(wire, instance[key], ...params);
                }
            }
            return new Proxy<T>(instance, new ClassProxy<T>(target.meta.parameter, wire));
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
