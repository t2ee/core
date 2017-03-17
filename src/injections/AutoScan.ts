import * as fs from 'fs';
import * as path from 'path';
import MiscUtil from '../utils/MiscUtil';

function walk(dir: string): string[] {
    let result: string[] = [];
    const files: string[] = fs.readdirSync(dir);
    for (const loc of files) {
        const file: string = path.join(dir, loc);
        if (fs.lstatSync(file).isDirectory()) {
            result = result.concat(walk(file));
        } else {
            result.push(file);
        }
    }

    return result;
}

// tslint:disable-next-line no-empty-interface
export interface Config {
}

function AutoScanDecorator(config?: Config): (target: any) => any {
    config = config || {};

    return (target: any): any => {
        const directory: string = MiscUtil.getCallerDirectory();
        const location: string = path.dirname(directory);
        console.log(location);
        let files: string[] = walk(location);
        files.splice(files.indexOf(directory), 1);
        files = files.filter((file: string) => path.extname(file) === '.js');
        for (const file of files) {
            require(file);
        }

        return target;
    };
}

function AutoScan(target: any): any;
function AutoScan(config?: Config): ClassDecorator;
function AutoScan(target?: Config | any): ClassDecorator | any {
    if (target instanceof Function) { // used directly
        AutoScanDecorator()(target);
    } else {  // used as function call
        return AutoScanDecorator(target);
    }
}

export default AutoScan;
