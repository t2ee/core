import Provider from '../injections/Provider';
import AutoWireMeta from '../injections/AutoWireMeta';
import ClassConstructor from '../ClassConstructor';

export class BeanProvider implements Provider {
    private beans: Map<ClassConstructor<any>, any> = new Map<ClassConstructor<any>, any>();

    // tslint:disable-next-line
    public resolve<T>(value: T, meta: AutoWireMeta , args: any[]): T {
        return this.beans.get(meta.type as ClassConstructor<any>);
    }

    public provide<T>(type: ClassConstructor<T>, value: T): void {
        this.beans.set(type, value);
    }
}

const beanProvider: BeanProvider = new BeanProvider();
export default beanProvider;
