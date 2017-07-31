import 'reflect-metadata';
import AutoWired from './AutoWired';
import test from 'ava';
import Container from '../injections/Container';

class A {}

class Test {
    @AutoWired a: String;
    @AutoWired('b') b: String;

    constructor(@AutoWired a: String, @AutoWired('b') b: String) {
    }
    test(@AutoWired a: String, @AutoWired('b') b: String) {

    }
}

test('@Value', t => {
    const meta = Container.extractMeta(Test);
    t.deepEqual(meta, {
        argument: {
            0: [{
                type: String,
                declaredType: String,
                data: undefined,
            }],
            1: [{
                type: 'b',
                declaredType: String,
                data: undefined,
            }],
        },
        parameter: {
            test: {
                0: [{
                    type: String,
                    declaredType: String,
                    data: undefined,
                }],
                1: [{
                    type: 'b',
                    declaredType: String,
                    data: undefined,
                }],
            },
        },
        property: {
            a: [{
                type: String,
                declaredType: String,
                data: undefined,
            }],
            b: [{
                type: 'b',
                declaredType: String,
                data: undefined,
            }],
        }
    });
});
