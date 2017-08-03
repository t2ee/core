import ClassConstructor from '../ClassConstructor';
import Provider from './Provider';
import AutoWireMeta from './AutoWireMeta';
import ComponentMeta from './ComponentMeta';
import Metadata from '../utils/Metadata';
import Scope from '../scopes/Scope';

class ClassProxy<T extends Object> implements ProxyHandler<T> {

    public constructor(
        private parameters: {[key: string]: {[index: number]: AutoWireMeta[]}},
        private properties: {[key: string]:  AutoWireMeta[]},
        private wire: AutoWireMeta,
        private params: any[],
    ) {
    }

    public get(target: T, key: PropertyKey, receiver: any): any {
        const passInData: any = this.params;
        if (key in this.parameters) { // this is a function
            const metas: {[index: number]: AutoWireMeta[]} = this.parameters[key];
            const method: Function = target[key];

            return function (...params: any[]): any {
                for (const index in metas) {
                    for (const wire of metas[index]) {
                        params[index] = Container.get(wire, params[index], ...passInData);
                    }
                }

                return method.apply(this, params);
            };
        }

        let value = target[key];

        if ((key in this.properties)) {
            this.properties[key]
            for (const meta of this.properties[key]) {
                if (!meta.inited) {
                    value = Container.get(meta, value, ...passInData);
                    meta.inited = true;
                }
            }
        }

        return value;
    }
}

class Container {
    private static components = new Map<string | Symbol | ClassConstructor<any>, {providers: Set<Provider>, meta: ComponentMeta}>();
    private static providers = new Map<string | Symbol | ClassConstructor<any>, Set<Provider>>();
    private static implementations = new Map<string | Symbol | ClassConstructor<any>, ClassConstructor<any>>();


    public static get<T extends Object>(wire: AutoWireMeta, defaultValue?: T, ...params: any[]): T;
    public static get<T extends Object>(identifier: ClassConstructor<T> | Symbol | string, defaultValue?: T, ...params: any[]): T;
    public static get<T extends Object>(identifierOrWire: AutoWireMeta | ClassConstructor<T> | Symbol | string, defaultValue?: T, ...params: any[]): T {
        let identifier: ClassConstructor<T> | Symbol | string = null;
        let wire: AutoWireMeta = null;
        params = params || [];

        if (~['function', 'symbol', 'string'].indexOf(typeof identifierOrWire)) { // identifier
            identifier = identifierOrWire as any;
            if (typeof identifierOrWire === 'function') {
                wire = {
                    type: identifierOrWire,
                    declaredType: identifierOrWire,
                };
            } else {
                wire = {
                    type: identifierOrWire as any,
                    declaredType: null,
                };
            }
        } else {
            wire = identifierOrWire as AutoWireMeta;
            identifier = wire.type;
        }

        if (Container.implementations.has(identifier)) {
            identifier = Container.implementations.get(identifier);
            wire = {
                type: identifier,
                declaredType: null,
            };
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
        const parameters = [];

        if (target && target.meta) {
            for (const index in (target.meta.argument || {})) {
                for (const wire of target.meta.argument[index]) {
                    parameters[index] = Container.get(wire, null);
                }
            }
        }
        wire.constructorParams = parameters;

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
                    //instance[key] = Container.get(wire, instance[key], ...params);
                }
            }
            return new Proxy<T>(instance, new ClassProxy<T>(target.meta.parameter, target.meta.property, wire, params));
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

    public static extractMeta(target: ClassConstructor<any>): ComponentMeta {
        return {
            argument:  Metadata.get('t2ee:core:autowire:argument', target.prototype) || {},
            parameter:  Metadata.get('t2ee:core:autowire:parameter', target.prototype) || {},
            property:  Metadata.get('t2ee:core:autowire:property', target.prototype) || {},
        }
    }

    public static provide<T>(type: string | Symbol | ClassConstructor<T>, implementation: ClassConstructor<T>): void {
        Container.implementations.set(type, implementation);
    }

}

export default Container;
