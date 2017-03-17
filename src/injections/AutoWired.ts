import Metadata from '../utils/Metadata';
import ClassConstructor from '../ClassConstructor';

export interface Config {
    lazy?: boolean;
    meta?: Map<string, any>;
    // tslint:disable-next-line prefer-method-signature
    resolve?: <T>(klass: ClassConstructor<T>, meta: Map<string, any>) => T;
}

export interface Meta extends Config {
    klass: ClassConstructor<any>;
}

function AutoWiredDecorator(config?: Config): (target: any, key?: string, index?: number) => any {
    config = config || {
        lazy: false,
    };

    return (target: any, key?: string, index?: number): any => {
    //console.log(target, target.prototype, key, index, )
        // tslint:disable-next-line strict-type-predicates
        const isParameter: boolean = index !== undefined;
        // tslint:disable-next-line strict-type-predicates
        if (isParameter) {
            // tslint:disable-next-line
            if (key === undefined) { // constructor parameter
                const klass: ClassConstructor<any> = Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[key: string]: Meta} = Metadata.get('c3po:wires:argument', target.prototype) || {};
                wires[index] = {
                    klass,
                    meta: config.meta,
                    lazy: config.lazy,
                    resolve: config.resolve,
                };
                Metadata.set('c3po:wires:arguments', wires, target.prototype);
            } else { // normal parameter
                const klass: ClassConstructor<any> = Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[key: string]: {[index: number]: Meta}} =
                    Metadata.get('c3po:wires:parameter', target) || {};
                wires[key] = wires[key] || {};
                wires[key][index] = {
                    klass,
                    meta: config.meta,
                    lazy: config.lazy,
                    resolve: config.resolve,
                };
                Metadata.set('c3po:wires:parameter', wires, target);

            }
        } else { // property decorator
            const klass: ClassConstructor<any> = Metadata.get(Metadata.builtIn.TYPE, target, key);
            const wires: {[key: string]: Meta} = Metadata.get('c3po:wires:property', target) || {};
            wires[key] = {
                klass,
                meta: config.meta,
                lazy: config.lazy,
                resolve: config.resolve,
            };
            Metadata.set('c3po:wires:property', wires, target);
        }
    };
}


function AutoWired(target: any, key: string, index: number): any;
function AutoWired(target: any, key: string): any;
function AutoWired(confg?: Config): (target: any, key?: string, index?: number) => any;
function AutoWired(target?: any, key?: string, index?: number): any {
    if (target.constructor.name !== 'Object') { // used directly
        return AutoWiredDecorator()(target, key, index);
    } else {  // used as function call
        return AutoWiredDecorator(target);
    }
}

export default AutoWired;
