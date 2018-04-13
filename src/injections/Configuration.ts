import Metadata from '../utils/Metadata';
import Container from './Container';
import Hashable from '../utils/Hashable';

function Configuration() {
    return (target: any): any => {
    	Container.provide(target);
		const instance: Hashable = Container.get(target);
		const property  = Container.getMeta(target).property;
		for (const key in property) {
			const meta = property[key].find(meta => meta.provider === Symbol.for('t2ee:core:bean-provider'));
			if (meta) {
                const value = instance[key]();
                Container.inject(meta.type, value)
				Container.inject(meta.functionType, value)
				Container.inject(key, value)
			}
		}
	};
}

export default Configuration;
