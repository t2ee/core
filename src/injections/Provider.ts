import {
    Meta,
} from './AutoWired';

interface Provider {
    get<T>(config: Meta): T;
}

export default Provider;
