import Metadata from '../utils/Metadata';
import ClassConstructor from '../ClassConstructor';
import BeanProvider from './BeanProvider';
import Container from '../injections/Container';
import Component from '../injections/Component';


function Configuration(target: any): any {
    const beans: {[key: string]: ClassConstructor<any>} = Metadata.get('t2ee:core:beans', target.prototype) || {};
    Component(target);
    const instance: any = Container.get(target);

    for (const key in beans) {
        const item: any = instance[key]();
        BeanProvider.provide(beans[key], item);
        BeanProvider.provide(<any> key, item);
        Container.inject(key, BeanProvider);
        Container.inject(beans[key], BeanProvider);
    }

    return target;
}

export default Configuration;
