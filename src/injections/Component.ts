import Container from './Container';
import AutoWireMeta from './AutoWireMeta';
import Metadata from '../utils/Metadata';
import { resolve } from 'path';

export default function Component(provider?: Symbol | string) {
    return (target: any) => {
        Container.provide(target, provider);
    };
}
