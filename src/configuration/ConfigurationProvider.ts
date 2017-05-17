import Provider from '../injections/Provider';
import ConfigurationStore from './ConfigurationStore';
import AutoWireMeta from '../injections/AutoWireMeta';

export class ConfigurationProvider implements Provider {
    // tslint:disable-next-line
    public resolve<T>(value: T, meta: AutoWireMeta , args: any[]): T {
        let val: any = ConfigurationStore.get(meta.data[0], meta.data[1], meta.data[2]);
        if (meta.declaredType === Number) {
            val = parseFloat(val);
        } else if (meta.declaredType === Boolean) {
            if (val === 'true' || val === true) {
                val = true;
            } else if (val === 'false' || val === false) {
                val = false;
            } else {
                throw new Error(`value '${val}' @ '${meta.data}' cannot be parsed as boolean`);
            }
        } else if (meta.declaredType === Date) {
            val = new Date(val);
        }

        return val;
    }
}

const configurationProvider: ConfigurationProvider = new ConfigurationProvider();
export default configurationProvider;
