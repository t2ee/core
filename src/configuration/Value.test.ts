import 'reflect-metadata';
import Value from './Value';
import test from 'ava';
import Container from '../injections/Container';

class A {}

class Test {
    @Value('a', 'b', true) test: String;
}

test('@Value', t => {
    const meta = Container.extractMeta(Test);
    t.deepEqual([{
        type: Symbol.for('t2ee:configuration:value'),
        declaredType: String,
        data: ['a', 'b', true],
    }], meta.property['test']);
});
