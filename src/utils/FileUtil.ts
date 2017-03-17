import * as fs from 'fs';
import * as path from 'path';

class FileUtil {
    private constructor() {}

    public static walk(dir: string): string[] {
        let result: string[] = [];
        const files: string[] = fs.readdirSync(dir);
        for (const loc of files) {
            const file: string = path.join(dir, loc);
            if (fs.lstatSync(file).isDirectory()) {
                result = result.concat(FileUtil.walk(file));
            } else {
                result.push(file);
            }
        }

        return result;
    }

    public static findNodeModules(dir: string): string {
        const nodeModules: string = path.join(dir, 'node_modules');
        if (fs.existsSync(nodeModules)) {
            return nodeModules;
        } else {
            return FileUtil.findNodeModules(path.resolve(dir, '../'));
        }
    }
}

export default FileUtil;
