import 'source-map-support/register';

import Component from './injections/Component';
import AutoWired from './injections/AutoWired';
import Container from './injections/Container';
import Bean from './configuration/Bean';
import Configuration from './configuration/Configuration';
import EnableConfiguration from './configuration/EnableConfiguration';
import ConfigurationProvider from './configuration/ConfigurationProvider';
import Value from './configuration/Value';

import Provider from './injections/Provider';
import AutoWireMeta from './injections/AutoWireMeta';

Container.register(Symbol.for('t2ee:core:value'), ConfigurationProvider);

export {
    Container,
    AutoWired,
    Component,

    Provider,
    AutoWireMeta,

    Bean,
    Configuration,

    EnableConfiguration,
    Value,
}
