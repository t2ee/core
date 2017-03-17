
type ClassConstructor<T> = new (...args: any[]) => T;

export type ClassConstructor1<T, A> = new (a: A) => T;
export type ClassConstructor2<T, A, B> = new (a: A, b: B) => T;
export type ClassConstructor3<T, A, B, C> = new (a: A, b: B, c: C) => T;
export type ClassConstructor4<T, A, B, C, D> = new (a: A, b: B, c: C, d: D) => T;

export default ClassConstructor;
