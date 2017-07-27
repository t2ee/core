import Metadata from '../utils/Metadata';
import ClassConstructor from '../ClassConstructor';
import AutoWireMeta from './AutoWireMeta';

function AutoWiredDecorator(name?: Symbol | string, data?: any):
    (target: any, key?: string, index?: number) => any {
    return (target: any, key?: string, index?: number): any => {
        // tslint:disable-next-line strict-type-predicates
        const isParameter: boolean = index !== undefined;
        // tslint:disable-next-line strict-type-predicates

        if (isParameter) {
            // tslint:disable-next-line
            if (key === undefined) { // constructor parameter
                const declaredType: ClassConstructor<AutoWireMeta> =
                    Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[index: number]: AutoWireMeta} =
                    Metadata.get('t2ee:core:autowire:argument', target.prototype) || {};
                wires[index] = {
                    type: name || declaredType,
                    declaredType,
                    data,
                };
                Metadata.set('t2ee:core:autowire:argument', wires, target.prototype);
            } else { // normal parameter
                const declaredType: ClassConstructor<any> =
                    Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[key: string]: {[index: number]: AutoWireMeta}} =
                    Metadata.get('t2ee:core:autowire:parameter', target) || {};

                wires[key] = wires[key] || {};
                wires[key][index] = {
                    type: name || declaredType,
                    declaredType,
                    data,
                };
                Metadata.set('t2ee:core:autowire:parameter', wires, target);
            }
        } else { // property decorator
            const declaredType: ClassConstructor<any> = Metadata.get(Metadata.builtIn.TYPE, target, key);
            const wires: {[key: string]: AutoWireMeta} =
                Metadata.get('t2ee:core:autowire:property', target) || {};
            wires[key] = {
                type: name || declaredType,
                declaredType,
                data,
            };
            Metadata.set('t2ee:core:autowire:property', wires, target);
        }

        //return target;
    };
}


function AutoWired(target: any, key: string, index: number): any;
function AutoWired(target: any, key: string): any;
function AutoWired(name?: string | Symbol, meta?: any):
    (target: any, key?: string, index?: number) => any;
function AutoWired(target?: any, key?: string | Symbol, index?: number): any {
    if (target !== null && (typeof target === 'object' || typeof target === 'function')) {
        return AutoWiredDecorator()(target, key as string, index);
    } else {
        return AutoWiredDecorator(target, key);
    }
}

export default AutoWired;
