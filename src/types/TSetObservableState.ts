import { TValueOrUpdater } from './TValueOrUpdater';

/** Set a value to a observable */
export type TSetObservableState<T> = (valueOrUpdater: TValueOrUpdater<T>) => void;
