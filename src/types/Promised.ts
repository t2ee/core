type Promised<T> = {
    [P in keyof T]: Promise<T[P]>;
};

export default Promised;
