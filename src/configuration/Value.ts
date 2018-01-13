import AutoWired from '../injections/AutoWired';

export default function Value(key: string, id?: string, required: boolean = false): any {
    return AutoWired(null, { key, id, required }, Symbol.for('t2ee:core:value'));
}
