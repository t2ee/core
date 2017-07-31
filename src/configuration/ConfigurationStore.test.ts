import 'reflect-metadata';
import test from 'ava';
import Metadata from '../utils/Metadata';
import ConfigurationStore from './ConfigurationStore';
import * as path from 'path';


test('ConfigurationStore', t => {
    enum E {
        A = 101,
        B = 102,
        C = 103,
        D = 104,
    }
    ConfigurationStore.provide('E', E);
    ConfigurationStore.provide('return', (val) => val);

    for (let i = 1; i <= 4; i++) {
        t.deepEqual(ConfigurationStore['readFile'](path.resolve(__dirname, `../../test-config/test${i}`)), {
            server: {
                port: 100 + i
            },
            enum: `E.${E[100 + i]}`,
            random: `return(${100 + i})`,
        });
    }

    t.is(ConfigurationStore['readFile'](path.resolve(__dirname, '../../test-config/test5')), null);
    ConfigurationStore.loadFile(path.resolve(__dirname, '../../test-config/test1'));
    t.is(ConfigurationStore.get('server.port'), 101);
    t.is(ConfigurationStore.get('server.port', 'test1'), 101);
    t.is(ConfigurationStore.get('server.port2', 'test1'), null);
    t.is(ConfigurationStore.get('server.port2'), null);
    t.is(ConfigurationStore.get('enum'), E.A);
    t.is(ConfigurationStore.get('random'), '101');
    let error = null;
    try {
        ConfigurationStore.get('server.port', 'test2', true);
    } catch (e) {
        error = e;
    }
    t.is(error.message, `Configuration 'test2' is not laoded`);
    error = null;
    try {
        ConfigurationStore.get('server.not_there', 'test1', true);
    } catch (e) {
        error = e;
    }
    t.is(error.message, `Value 'server.not_there' is not found in any configuration.`);
    ConfigurationStore.loadFile(path.resolve(__dirname, '../../test-config/test1'), 'test');
    t.is(ConfigurationStore.get('server.port'), 102);
    t.is(ConfigurationStore.get('random'), 102);
});
