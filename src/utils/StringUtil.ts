
class StringUtil {
    private constructor() {}

    public static insertAt(target: string, index: number, insert: string): string {
        return target.substr(0, index) + insert + target.substr(index);
    }
}

export default StringUtil;
