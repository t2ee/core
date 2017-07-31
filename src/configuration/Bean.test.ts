import 'reflect-metadata';
import Bean from './Bean';
import test from 'ava';
import Metadata from '../utils/Metadata';

class A {}

class Test {
    @Bean a(): A {
        return null;
    }
    @Bean('a') b() {
        return null;
    }
}

test('@Bean', t => {
    const meta = Metadata.get('t2ee:core:beans', Test.prototype);
    t.deepEqual({
        a: A,
        b: 'a',
    }, meta);
});
