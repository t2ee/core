
interface AutoWireMeta {
    type:  (new (...args: any[]) => any) | Symbol | string;
    declaredType:  new (...args: any[]) => any;
    functionType?: new (...args: any[]) => any;
    data?: any;
    provider?: Symbol | string;
}

export default AutoWireMeta
