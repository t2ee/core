import Container from './Container';

export default function Component(provider?: Symbol | string) {
    return (target: any) => {
        Container.provide(target, provider);
    };
}
