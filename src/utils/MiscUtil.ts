import * as path from 'path';
import * as Callsite from 'callsite';

class MiscUtil {
    private constructor() {}

    public static gtetCallerFile(): string {
        const stacks: Callsite.CallSite[] = Callsite();
        let lastBeforeModuleFile: string = null;
        let lastFile: string = null;
        for (const stack of stacks) {
            if (stack.getFileName() === 'module.js' && lastFile !== 'module.js') {
                lastBeforeModuleFile = lastFile;
            }
            lastFile = stack.getFileName();
        }

        return lastBeforeModuleFile;
    }

    public static getCallerDirectory(): string {
        return path.dirname(MiscUtil.gtetCallerFile());
    }
}

export default MiscUtil;
