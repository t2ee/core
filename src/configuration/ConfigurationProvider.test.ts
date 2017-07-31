import 'reflect-metadata';
import test from 'ava';
import Metadata from '../utils/Metadata';
import ConfigurationStore from './ConfigurationStore';
import ConfigurationProvider from './ConfigurationProvider';
import * as path from 'path';


test('ConfigurationProvider', t => {
    ConfigurationStore.loadFile(path.resolve(__dirname, '../../test-config/test'));
    t.is(ConfigurationProvider.resolve(null, { type: null, declaredType: String, data: ['str']}, []), 'hello');
    t.is(ConfigurationProvider.resolve(null, { type: null, declaredType: String, data: ['num']}, []), '123');
    t.is(ConfigurationProvider.resolve(null, { type: null, declaredType: Number, data: ['num']}, []), 123);
    t.is(ConfigurationProvider.resolve(null, { type: null, declaredType: Boolean, data: ['bool']}, []), true);
    t.is(ConfigurationProvider.resolve(null, { type: null, declaredType: Date, data: ['date']}, []).getTime(), 1501490214325);

    let error = null;
    try {
        ConfigurationProvider.resolve(null, { type: null, declaredType: Boolean, data: ['wrong_bool']}, []);
    } catch (e) {
        error = e;
    }
    t.is(error.message, `value 'yes' @ 'wrong_bool' cannot be parsed as boolean`);
});
