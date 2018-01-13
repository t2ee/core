import AutoWireMeta from './AutoWireMeta';
import Metadata from '../utils/Metadata';
import ComponentMeta from './ComponentMeta';
import Provider from './Provider';

class MetaResolver {
    private providers = new Map<string | Symbol, Provider>();
    private args: any[] = [];
    constructor(...args: any[]) {
        this.args = args;
    }

    public updateArgs(...args: any[]) {
        this.args = args;
    }

    public resolve(value: any, metas: AutoWireMeta[]): any {
        for (const meta of metas) {
            let provider: Provider = this.providers.get(meta.provider);
            if (!provider) {
                const providerClass = Container['provider'].get(meta.provider);
                if (providerClass) {
                    provider = new providerClass(...this.args);
                    this.providers.set(meta.provider, provider);
                }
            }
            if (provider) {
                value = provider.resolve(value, meta.type, meta.declaredType, meta.data);
            } else {
                value = Container.get(meta.type);
            }
        }
        return value;
    }
}

class ClassProxy<T extends Object> implements ProxyHandler<T> {
    constructor(
        private parameters: {[key: string]: {[index: number]: AutoWireMeta[]}},
        private properties: {[key: string]:  AutoWireMeta[]}
    ) {
    }

    public get(target: T, key: PropertyKey, receiver: any): any {
        if (key in this.parameters) { // this is a function
            const metas: {[index: number]: AutoWireMeta[]} = this.parameters[key];
            const method: Function = target[key];

            return function (...params: any[]): any {
                const resolver = new MetaResolver(...params);
                for (const index in metas) {
                    params[index] = resolver.resolve(params[index], metas[index]);
                }

                return method.apply(this, params);
            };
        }

        return target[key];
    }
}

export default class Container {
    private static injected = new Map<(new (...args: any[]) => any) | Symbol | string, any>();
    private static providedMeta = new Map<new (...args: any[]) => any, ComponentMeta>();
    private static provider = new Map<Symbol | string,  new (...args) => Provider>();

    public static get<T extends Object>(target: (new (...args: any[]) => T) | Symbol | string, ...data: any[]): T {
        let instance: T = null;
        instance = Container.injected.get(target);
        if (instance) {
            return instance;
        }

        if (typeof target !== 'function') {
            return null;
        }

        const classMeta = Container.providedMeta.get(target);
        if (!classMeta) {
            return null;
        }

        const args = data;
        const resolver = new MetaResolver(...args);

        for (const index in classMeta.argument) {
            const metas = classMeta.argument[index];
            args[index] = resolver.resolve(args[index], metas);
        }
        resolver.updateArgs(args);

        instance = new target(...args);
        const providerClass = Container.provider.get(classMeta.provider);
        const provider = providerClass && new providerClass(...data);
        if (provider) {
            instance = provider.resolve(instance, target, target, args);
        }

        for (const key in classMeta.property) {
            // ignore method property
            if (classMeta.property[key][0] && classMeta.property[key][0].declaredType === Function) {
                continue;
            }
            instance[key] = resolver.resolve(instance[key], classMeta.property[key]);
        }

        return new Proxy(instance, new ClassProxy<T>(classMeta.parameter, classMeta.property));
    }

    public static provide(target: any, provider?: Symbol | string) {
        const argument: {[index: number]: AutoWireMeta[]} =
            Metadata.get('t2ee:core:autowire:argument', target.prototype) || {};
        const parameter: {[key: string]: {[index: number]: AutoWireMeta[]}} =
            Metadata.get('t2ee:core:autowire:parameter', target.prototype) || {};
        const property: {[key: string]: AutoWireMeta[]} =
            Metadata.get('t2ee:core:autowire:property', target.prototype) || {};
        Container.providedMeta.set(target, {
            argument,
            parameter,
            property,
            provider,
        });
    }

    public static getMeta(target: any): ComponentMeta {
        return Container.providedMeta.get(target);
    }

    public static inject(type: (new (...args: any[]) => any) | Symbol | string, value: any) {
        if (!type) {
            return;
        }
        Container.injected.set(type, value);
    }

    public static register(name: Symbol | string, provider: new (...args) => Provider) {
        if (!name || !provider) {
            return;
        }
        Container.provider.set(name, provider);
    }
}
