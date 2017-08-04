import * as YAML from 'js-yaml';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

export default class ConfigurationStore {
    private static store: Map<string, any> = new Map<string, any>();
    private static types: {[key: string]: any} = {};

    private static readFile(location: string): any {
        if (fs.existsSync(`${location}.yaml`)) {
            const file: string = fs.readFileSync(`${location}.yaml`).toString();
            return YAML.load(file);
        } else if (fs.existsSync(`${location}.yml`)) {
            const file: string = fs.readFileSync(`${location}.yml`).toString();
            return YAML.load(file);
        } else if (fs.existsSync(`${location}.json`)) {
            const file: string = fs.readFileSync(`${location}.json`).toString();
            return JSON.parse(file);
        } else if (fs.existsSync(`${location}.js`)) {
            return require(`${location}.js`);
        }
        return null;
    }

    public static loadFile(location: string, env?: string): void {
        let content: any = ConfigurationStore.readFile(location);
        if (content) {
            ConfigurationStore.load(path.basename(location), content);
        }

        if (env) {
            let content: any = ConfigurationStore.readFile(location + '.' + env);
            if (content) {
                ConfigurationStore.load(path.basename(location), content);
            }
        }
    }

    public static load(id: string, content: any): void {
        let value: any = this.store.get(id) || {};
        value = _.extend(value, content);
        this.store.set(id, value);
    }

    public static get(key: string, id?: string, required: boolean = false): any {
        if (id) {
            const obj: any = ConfigurationStore.store.get(id);
            if (!obj && required) {
                throw new Error(`Configuration '${id}' is not laoded`);
            }

            return ConfigurationStore.getValue(obj, key, required);
        } else {
            for (const storeKey of ConfigurationStore.store.keys()) {
                const obj: any = ConfigurationStore.store.get(storeKey);
                if (!obj) {
                    continue;
                }
                if (_.has(obj, key)) {
                    return ConfigurationStore.getValue(obj, key, required);
                }
            }
            return null;
        }
    }

    private static getValue(obj: any, key: string, required: boolean): any {
        if (!_.has(obj, key)) {
            if (required) {
                throw new Error(`Value '${key}' is not found in any configuration.`);
            } else {
                return null;
            }
        }

        let value: any = _.get(obj, key);
        if (typeof value === 'string') {
            value = ConfigurationStore.parseValue(value);
        }

        return value;
    }

    private static parseValue(value: string): any {
        const regex = /([\w\_\$][\w\d\_|$]*)\((.*)\)/;
        if (regex.test(value)) {
            const [_, func, params] = value.match(regex);
            if (func in ConfigurationStore.types) {
                value = ConfigurationStore.types[func](...params.split(',').map(ConfigurationStore.parseValue));
            }
        } else if (value.split('.')[0] in ConfigurationStore.types) { // simple object
            const values: string[] = value.split('.');
            const rest: string = values.slice(1).join('.');
            value = _.get(ConfigurationStore.types[values[0]], rest);
        }
        return value;
    }

    public static provide(key: string, value: any): void {
        ConfigurationStore.types[key] = value;
    }

}

