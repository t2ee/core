import Metadata from '../utils/Metadata';
import ClassConstructor from '../ClassConstructor';

function BeanDecorator(name?: string) {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) => {
        const beans: {[key: string]: ClassConstructor<any>} = Metadata.get('t2ee:core:beans', target) || {};
        beans[key] = name || Metadata.get(Metadata.builtIn.RETURN_TYPE, target, key);
        Metadata.set('t2ee:core:beans', beans, target);
    };
}

function Bean(name: string): any;
function Bean(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any;
function Bean(targetOrName: string | any, key?: string, descriptor?: TypedPropertyDescriptor<any>): any {
    if (typeof targetOrName === 'string') {
        return BeanDecorator(targetOrName);
    } else {
        return BeanDecorator()(targetOrName, key, descriptor);
    }
}

export default Bean;
