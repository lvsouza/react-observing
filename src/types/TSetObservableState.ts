export type TSetObservableState<T> = (valOrUpdater: ((currVal: T) => T) | T) => void
