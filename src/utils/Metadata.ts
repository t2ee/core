export interface BuiltIn {
    TYPE: string;
    PARAM_TYPE: string;
    RETURN_TYPE: string;
}

class Metadata {
    private constructor() {}

    public static set(metaKey: string, metaValue: any, target: any, key?: string | symbol): void {
        (Reflect as any).defineMetadata(metaKey, metaValue, target, key);
    }

    public static get(metaKey: string, target: any, key?: string | symbol): any  {
        return (Reflect as any).getMetadata(metaKey, target, key);
    }

    public static builtIn: BuiltIn = {
        TYPE: 'design:type',
        PARAM_TYPE: 'design:paramtypes',
        RETURN_TYPE: 'design:returntype',
    };
}

export default Metadata;
