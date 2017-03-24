import ClassConstructor from '../ClassConstructor';

export default class Class<T> {

    private constructor(private prototype: ClassConstructor<T>, private _name: string) {
    }

    public newInstance(...params: any[]): T {
        return new this.prototype(...params);
    }

    public get className(): string {
        return this.prototype.name;
    }

    public get name(): string {
        return this._name;
    }

    public get class(): ClassConstructor<T> {
        return this.prototype;
    }

    public static forName<T>(moduleName: string, className?: string): Class<T> {
        const m: any = require(moduleName);
        let klass: any = m;
        if (className) {
            klass = m[className];
        }

        return new Class<T>(klass, className);
    }

    public static fromPrototype<T>(klass: ClassConstructor<T>, name: string): Class<T> {
        return new Class<T>(klass, name);
    }
}
