import 'reflect-metadata';
import test from 'ava';
import Metadata from '../utils/Metadata';
import Configuration from './Configuration';
import beanProvider from './BeanProvider';
import Container from '../injections/Container';
import Bean from './Bean';


test('@Configuration', t => {

    class A {}
    const a = new A();
    const b = new A();

    @Configuration
    class Test {
        @Bean b(): A {
            return a;
        }
        @Bean('d') c(): A {
            return b;
        }
    }

    @Configuration
    class B {}

    t.is(beanProvider.resolve(null , { type: A, declaredType: A}, []), a);
    t.is(beanProvider.resolve(null , { type: 'b', declaredType: A}, []), a);
    t.is(beanProvider.resolve(null , { type: 'c', declaredType: A}, []), b);
    t.is(beanProvider.resolve(null , { type: 'd', declaredType: A}, []), b);

    t.is(Container.get(A), a);
    t.is(Container.get('b'), a);
    t.is(Container.get('c'), b);
    t.is(Container.get('d'), b);

});
