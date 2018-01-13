import 'source-map-support/register';

import Component from './injections/Component';
import Singleton from './injections/Singleton';
import AutoWired from './injections/AutoWired';
import Container from './injections/Container';

import Provider from './injections/Provider';
import AutoWireMeta from './injections/AutoWireMeta';

import Bean from './configuration/Bean';
import Configuration from './configuration/Configuration';

import EnableConfiguration from './configuration/EnableConfiguration';
import ConfigurationProvider from './configuration/ConfigurationProvider';
import Value from './configuration/Value';
import ConfigurationStore from './configuration/ConfigurationStore';

import Metadata from './utils/Metadata';

Container.register(Symbol.for('t2ee:core:value'), ConfigurationProvider);

export {
    Component,
    Singleton,
    AutoWired,
    Container,

    Provider,
    AutoWireMeta,

    Bean,
    Configuration,

    EnableConfiguration,
    Value,
    ConfigurationStore,
    ConfigurationProvider,

    Metadata,
}
