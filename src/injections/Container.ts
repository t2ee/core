import AutoWireMeta from './AutoWireMeta';
import Metadata from '../utils/Metadata';
import ComponentMeta from './ComponentMeta';
import Provider from './Provider';

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
                for (const index in metas) {
                    params[index] = Container.resolve(params[index], metas[index]);
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
    private static provider = new Map<Symbol | string, Provider>();

    public static get<T>(target: (new (...args: any[]) => T) | Symbol | string, ...data: any[]): T {
        let instance: T = null;
        instance = Container.injected.get(target);
        if (instance) {
            return instance;
        }

        if (typeof target !== 'function') {
            return null;
        }


        const meta = Container.providedMeta.get(target);
        if (!meta) {
            return null;
        }

        const args = data;

        for (const index in meta.argument) {
            const metas = meta.argument[index];
            args[index] = Container.resolve(args[index], metas);
        }

        instance = new target(...args);
        const provider = Container.provider.get(meta.provider);
        if (provider) {
            instance = provider.resolve(instance, target, target, args);
        }

        for (const key in meta.property) {
            // ignore method
            if (meta.property[key][0] && meta.property[key][0].declaredType === Function) {
                continue;
            }
            instance[key] = Container.resolve(instance[key], meta.property[key]);
        }

        return instance;
    }

    public static resolve(value: any, metas: AutoWireMeta[]): any {
        for (const meta of metas) {
            const provider = Container.provider.get(meta.provider);
            if (provider) {
                value = provider.resolve(value, meta.type, meta.declaredType, meta.data);
            } else {
                value = Container.get(meta.type);
            }
        }
        return value;
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

    public static register(name: Symbol | string, provider: Provider) {
        if (!name || !provider) {
            return;
        }
        Container.provider.set(name, provider);
    }
}
