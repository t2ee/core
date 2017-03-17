import Container from './Container';
import ClassConstructor from '../ClassConstructor';


export interface Config {
    for?: ClassConstructor<any>;
}

function InjectableDecorator(config?: Config): (target: any) => any {
    config = config || {
    };

    return (target: any): any => {
        Container.provide(target, config.for || target);

        return target;
    };
}

function Injectable(target: any): any;
function Injectable(config?: Config): (target: any) => any;
function Injectable(target?: Config | any): any {
    if (target instanceof Function) { // used directly
        return InjectableDecorator()(target);
    } else {  // used as function call
        return InjectableDecorator(target);
    }
}

export default Injectable;
