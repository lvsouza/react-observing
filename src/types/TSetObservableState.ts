/** Set a value to a observable */
export type TSetObservableState<T> = (valueOrUpdater: ((currVal: T) => T) | T) => void
