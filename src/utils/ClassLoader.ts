import * as fs from 'fs';
import * as path from 'path';
import FileUtil from './FileUtil';
import Class from './Class';


function listNodeModuleFiles(folder: string): string[] {
    const packageJson: any = JSON.parse(fs.readFileSync(path.resolve(folder, 'package.json')).toString());
    const mainPath: string = path.dirname(path.resolve(folder, packageJson.main));

    return FileUtil.walk(mainPath);
}

export class ClassLoader {
    private static files: string[] = [];


    public static loadAtPath(location: string): void {
        const folder: string = path.dirname(location);
        const nodeModulesRoot: string =  FileUtil.findNodeModules(folder);
        const nodeModuleFolders: string[] = fs.readdirSync(nodeModulesRoot);

        const nodeModules: string[] = [];

        for (const nodeModule of nodeModuleFolders) {
            const nodeModuleName: string = path.resolve(nodeModulesRoot, nodeModule);
            if (nodeModule[0] === '@') {
                for (const m of fs.readdirSync(nodeModuleName)) {
                    nodeModules.push(...listNodeModuleFiles(m));
                }
            } else {
                nodeModules.push(...listNodeModuleFiles(nodeModuleName));
            }
        }

        const files: string[] = FileUtil
                .walk(location)
                .concat(nodeModules)
                .filter((file: string) => path.extname(file) === '.js');

        ClassLoader.files = files;
    }

    public static getClass<T>(moduleName: string, className?: string): Class<T> {
        if (ClassLoader.files.indexOf(moduleName) !== -1) {
            return Class.forName<T>(moduleName, className);
        }

        return null;
    }

}

export default ClassLoader;
