import Metadata from '../utils/Metadata';
import ClassConstructor from '../ClassConstructor';
import Provider from './Provider';
import { Meta } from './AutoWired';
export type Scope = void;

class ClassProxy<T> implements ProxyHandler<T> {
    private initedProperty: {[key: string]: any} = {};

    public constructor(
        private lazyProperty: {[key: string]: Meta},
        private parameters: {[method: string]: {[index: number]: Meta}},
        private provider: Provider,
    ) {
    }

    public get(target: T, key: PropertyKey, receiver: any): any {
        if (key in this.parameters) {
            const metas: {[index: number]: Meta} = this.parameters[key];
            const method: Function = target[key];
            const provider: Provider = this.provider;

            return function (...params: any[]): any {
                for (const index in metas) {
                    const p: Meta = metas[index];
                    if (p.resolve) {
                        params[parseInt(index)] = p.resolve(p.klass, p.meta);
                    } else {
                        params[parseInt(index)] = Container.get(p.klass, provider);
                        if (params[parseInt(index)] === undefined) {
                            params[parseInt(index)]  = provider.get<any>(p);
                        }
                    }
                }

                return method.apply(this, params);
            };
        }
        if (key in this.lazyProperty) {
            if (!(key in this.initedProperty)) {
                const p: Meta = this.initedProperty[key];
                if (p.resolve) {
                    this.initedProperty[key] = p.resolve(p.klass, p.meta);
                } else {
                    this.initedProperty[key] = Container.get(p.klass, this.provider);
                }
            }

            return this.initedProperty[key];
        }

        return target[key];
    }
}

export class DefaultConatinerProvider implements Provider {
    public get<T>(config: Meta): T {
        return Container.get(config.klass, this);
    }
}

interface Resolver<T> {
    scope: Scope;
    target: ClassConstructor<T>;
}

class Container {
    private static injectables: Map<ClassConstructor<any>, Resolver<any>> =
        new Map<ClassConstructor<any>, Resolver<any>>();
    public static DefaultProvider: Provider = new DefaultConatinerProvider();

    public static get<T>(klass: ClassConstructor<T>, provider: Provider, ...params: any[]): T {
        params = params || [];
        if (Container.injectables.has(klass)) {
            const {
                target,
                //scope,
            }: Resolver<any> = Container.injectables.get(klass);

            const args: {[key: string]: Meta} = Metadata.get('c3po:wires:argument', target.prototype) || {};
            const parameters: {[key: string]: {[index: number]: Meta }} =
                Metadata.get('c3po:wires:parameter', target.prototype) || {};
            const property: Meta[] = Metadata.get('c3po:wires:property', target.prototype) || [];

            for (const index in args) {
                params[parseInt(index)] = Container.get(args[index].klass, provider);
            }
            const instance: any = new target(...params);

            const lazyProperty: {[key: string]: Meta} = {};

            for (const key in property) {
                const p: Meta = property[key];
                if (!p.lazy) {
                    if (p.resolve) {
                        instance[key] = p.resolve(p.klass, p.meta);
                    } else {
                        instance[key] = provider.get<any>(p);
                    }
                } else {
                    lazyProperty[key] = p;
                }
            }

            return new Proxy<T>(instance, new ClassProxy<T>(lazyProperty, parameters, provider));
        } else {
            return undefined;
        }
    }

    public static provide<P, T extends P>(target: ClassConstructor<T>, type: ClassConstructor<P>, scope?: Scope): void {
        Container.injectables.set(type, { target, scope });
    }

}

export default Container;
