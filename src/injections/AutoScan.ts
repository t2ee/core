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


function AutoScanDecorator(directories?: string[]): (target: any) => any {

    return (target: any): any => {
        const locations: string[] = [];

        if (directories.length) {
            locations.push(...directories);
        } else {
            const directory: string = MiscUtil.getCallerDirectory();
            locations.push(path.dirname(directory));
        }

        for (const location of locations) {
            let files: string[] = walk(location);
            files.splice(files.indexOf(location), 1);
            files = files.filter((file: string) => path.extname(file) === '.js');
            for (const file of files) {
                require(file);
            }
        }

        //return target;
    };
}

function AutoScan(target: any): any;
function AutoScan(...paths: string[]): ClassDecorator;
function AutoScan(target?: string[] | string | any): ClassDecorator | any {
    if (target instanceof Function) { // used directly
        return AutoScanDecorator([])(target);
    } else {  // used as function call
        return AutoScanDecorator(target);
    }
}

export default AutoScan;
