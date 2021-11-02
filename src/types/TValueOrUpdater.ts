
export type TUpdater<T> = ((currVal: T) => T) | (() => T);

export type TValueOrUpdater<T> = TUpdater<T> | T;
