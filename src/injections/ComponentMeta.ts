import AutoWireMeta from './AutoWireMeta';
import Scope from '../scopes/Scope';

interface ComponentMeta {
    argument: {[index: number]: AutoWireMeta};
    parameter: {[key: string]: {[index: number]: AutoWireMeta}};
    property: {[key: string]: AutoWireMeta};
    scope?: Scope[];
}

export default ComponentMeta;
