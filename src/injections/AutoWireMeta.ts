import ClassConstructor from '../ClassConstructor';

interface AutoWireMeta {
    type: ClassConstructor<any> | Symbol | string;
    declaredType: ClassConstructor<any>;
    data?: any;
    constructorParams?: any[];
}

export default AutoWireMeta;
