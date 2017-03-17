class EnumUtil {
    private constructor() {}

    public static toString(enumClass: any, radix: number): string {
        const keys: string[] = Object.keys(enumClass);
        const values: number[] = keys.map((key: string) => enumClass[key]);

        return keys[values.indexOf(radix)] || null;
    }

    public static toEnum(value: string, enumClass: any): number {
        return enumClass[value];
    }
}

export default EnumUtil;
