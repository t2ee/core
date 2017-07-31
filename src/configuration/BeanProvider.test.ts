import 'reflect-metadata';
import test from 'ava';
import Metadata from '../utils/Metadata';

import beanProvider from './BeanProvider';

test('BeanProvider', t => {
    class A {}
    const a = new A();
    beanProvider.provide(A, a);
    const result = beanProvider.resolve(null , { type: A, declaredType: A}, []);
    t.true(result instanceof A);
    t.is(result, a);
});
