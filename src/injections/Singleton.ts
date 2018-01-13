import Container from './Container';

export default function Singleton() {
    return (target: any) => {
        const instance = Container.get(target);
        Container.inject(target, instance);
    }
}
