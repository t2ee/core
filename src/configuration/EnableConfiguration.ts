import ConfigurationStore from './ConfigurationStore';

export default function EnableConfiguration(...files: (string | Function)[]): (target: any) => any {
    return (target: any): any => {
        for (const file of files) {
            if (typeof file === 'function') {
                ConfigurationStore.loadFile(file());
            } else {
                ConfigurationStore.loadFile(file);
            }
        }

        return target;
    };
}
