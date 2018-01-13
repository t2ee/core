import Metadata from '../utils/Metadata';
import AutoWireMeta from './AutoWireMeta';

export default function AutoWired(type?: (new (...args: any[]) => any) | Symbol | string, data?: any, provider?: Symbol | string) {
    return (target: any, key?: string, index?: number) => {
        const isParameter: boolean = index !== undefined;

        if (isParameter) {
            if (key === undefined) { // constructor parameter
                const declaredType =
                    Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[index: number]: AutoWireMeta[]} =
                    Metadata.get('t2ee:core:autowire:argument', target.prototype) || {};
                wires[index] = wires[index] || [];
                wires[index].push({
                    type: type || declaredType,
                    declaredType,
                    provider,
                    data,
                });
                Metadata.set('t2ee:core:autowire:argument', wires, target.prototype);
            } else { // normal parameter
                const declaredType =
                    Metadata.get(Metadata.builtIn.PARAM_TYPE, target, key)[index];
                const wires: {[key: string]: {[index: number]: AutoWireMeta[]}} =
                    Metadata.get('t2ee:core:autowire:parameter', target) || {};

                wires[key] = wires[key] || {};
                wires[key][index] = wires[key][index] || []
                wires[key][index].push({
                    type: type|| declaredType,
                    declaredType,
                    provider,
                    data,
                });
                Metadata.set('t2ee:core:autowire:parameter', wires, target);
            }
        } else { // property decorator
            const declaredType = Metadata.get(Metadata.builtIn.TYPE, target, key);
            const wires: {[key: string]: AutoWireMeta[]} =
                Metadata.get('t2ee:core:autowire:property', target) || {};
            let functionType = null;
            if (declaredType === Function) {
                functionType = Metadata.get(Metadata.builtIn.RETURN_TYPE, target, key);
            }
            wires[key] = wires[key] || [];
            wires[key].push({
                type: type || declaredType,
                provider,
                declaredType,
                functionType,
                data,
            });
            Metadata.set('t2ee:core:autowire:property', wires, target);
        }
    }
}
