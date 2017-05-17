// tslint:disable-next-line
import 'source-map-support/register';

import ClassConstructor from './ClassConstructor';
import AutoScan from './injections/AutoScan';
import AutoWired from './injections/AutoWired';
import Container from './injections/Container';
import Component from './injections/Component';
import Provider from './injections/Provider';
import AutoWireMeta from './injections/AutoWireMeta';
import Partial from './types/Partial';
import Pick from './types/Pick';
import Promised from './types/Promised';
import Readonly from './types/Readonly';
import Class from './utils/Class';
import ClassLoader from './utils/ClassLoader';
import EnumUtil from './utils/EnumUtil';
import FileUtil from './utils/FileUtil';
import Metadata from './utils/Metadata';
import MiscUtil from './utils/MiscUtil';
import StringUtil from './utils/StringUtil';
import * as ClassConstructors from './ClassConstructor';
import configurationProvider from './configuration/ConfigurationProvider';
import Value from './configuration/Value';
import EnableConfiguration from './configuration/EnableConfiguration';
import ConfigurationStore from './configuration/ConfigurationStore';
import Configuration from './configuration/Configuration';
import Bean from './configuration/Bean';
import Scope from './scopes/Scope';
import SingletonScope from './scopes/SingletonScope';

Container.inject(Symbol.for('t2ee:configuration:value'), configurationProvider);

export {
    ClassConstructor,
    AutoScan,
    AutoWired,
    Container,
    Component,
    Provider,
    Partial,
    Pick,
    Promised,
    Readonly,
    Class,
    ClassLoader,
    EnumUtil,
    FileUtil,
    Metadata,
    MiscUtil,
    StringUtil,
    ClassConstructors,
    AutoWireMeta,
    Value,
    EnableConfiguration,
    ConfigurationStore,
    Configuration,
    Bean,
    Scope,
    SingletonScope,
};
