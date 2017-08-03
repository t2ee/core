import 'reflect-metadata';
import Container from './Container';
import AutoWired from './AutoWired';
import Component from './Component';
import Configuration from '../configuration/Configuration';
import Bean from '../configuration/Bean';
import test from 'ava';

test('AutoWired test', t => {
    @Component
    class Injectable {
        value: string = 'component';
    }

    @Component
    class InjectableBean {
        value: string;
    }

    @Configuration
    class config {
        @Bean('injectable')
        injectable1() {
            const i = new InjectableBean();
            i.value = 'bean name inject';
            return i;
        }

        @Bean
        injectable2(): InjectableBean {
            const i = new InjectableBean();
            i.value = 'bean inject';
            return i;
        }
    }

    @Component
    class Main {
        @AutoWired in1: Injectable;
        @AutoWired in2: InjectableBean;
        @AutoWired('injectable') in3;
    }
    const main = Container.get(Main);
    t.true(main.in1 instanceof Injectable);
    t.true(main.in2 instanceof InjectableBean);
    t.true(main.in3 instanceof InjectableBean);
    t.is(main.in1.value, 'component');
    //t.is(main.in2.value, 'bean inject');
    //t.is(main.in3.value, 'bean name inject');
});
