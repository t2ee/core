import AutoWired from '../injections/AutoWired';

export default function Bean(name?: string) {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) => {
        AutoWired(name, null, Symbol.for('t2ee:core:bean-provider'))(target, key);
    }
}
