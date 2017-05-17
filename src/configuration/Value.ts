import AutoWired from '../injections/AutoWired';

export default function Value(key: string, id?: string, required: boolean = false): any {
    return AutoWired(Symbol.for('t2ee:configuration:value'), [key, id, required]);
}
