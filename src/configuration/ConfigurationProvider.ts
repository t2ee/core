import Provider from '../injections/Provider';
import ConfigurationStore from './ConfigurationStore';
import AutoWireMeta from '../injections/AutoWireMeta';

export class ConfigurationProvider implements Provider {
    public resolve<T>(value: T, type:  (new (...args: any[]) => any) | Symbol | string, declaredType:  new (...args: any[]) => any, data: any): T {
        let val: any = ConfigurationStore.get(data.key, data.id, data.required);
        if (val === null || val === undefined) return null;
        if (declaredType === Number) {
            val = parseFloat(val);
        } else if (declaredType === Boolean) {
            if (val === 'true' || val === true) {
                val = true;
            } else if (val === 'false' || val === false) {
                val = false;
            } else {
                throw new Error(`value '${val}' @ '${data.key}' cannot be parsed as boolean`);
            }
        } else if (declaredType === Date) {
            val = new Date(val);
        }

        return val;
    }
}

const configurationProvider: ConfigurationProvider = new ConfigurationProvider();
export default configurationProvider;
