import Container from './Container';
import DefaultProvider from '../DefaultProvider';
import AutoWireMeta from './AutoWireMeta';
import Metadata from '../utils/Metadata';
import Scope from '../scopes/Scope';

export interface IConfig {
    scope?: Scope | Scope[];
}

function ComponentDecorator(config?: IConfig): ClassDecorator {
    config = config || {};

    return <TFunction extends Function>(target: TFunction): any => {
        const argument: {[index: number]: AutoWireMeta} =
            Metadata.get('t2ee:core:autowire:argument', target.prototype) || {};
        const parameter: {[key: string]: {[index: number]: AutoWireMeta}} =
                        Metadata.get('t2ee:core:autowire:parameter', target.prototype) || {};
        const property: {[key: string]: AutoWireMeta} =
            Metadata.get('t2ee:core:autowire:property', target.prototype) || {};

        let scope = config.scope;
        if (scope && !Array.isArray(scope)) {
            scope = [scope];
        } else {
            scope = [];
        }

        Container.inject(
            <any> target,
            DefaultProvider,
            {
                argument,
                parameter,
                property,
                scope,
            },
        );

        return target;
    };
}

function Component<TFunction extends Function>(target: Function): any;
function Component(config: IConfig): (target: any, key?: string, index?: number) => any;
function Component<TFunction extends Function>(target?: Function | IConfig): any {
    if (target !== null && (typeof target === 'function')) {
        return ComponentDecorator()(target);
    } else {
        return ComponentDecorator(<IConfig>target);
    }
}

export default Component;
