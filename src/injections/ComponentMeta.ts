import AutoWireMeta from './AutoWireMeta';

interface ComponentMeta {
    argument: {[index: number]: AutoWireMeta[]};
    parameter: {[key: string]: {[index: number]: AutoWireMeta[]}};
    property: {[key: string]: AutoWireMeta[]};
    provider?: Symbol | string;
}

export default ComponentMeta;
