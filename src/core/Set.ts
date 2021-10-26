// eslint-disable-next-line no-unused-vars
import { IObservable } from '../interfaces';

/**
 * Allows you to assign values to observables
 * @param observable - `IObserver<T>` Observable to assign a value
 * @param valOrUpdater Value or function to update the value
 * @returns void
 */
export function set<T>(observable: IObservable<T>, valOrUpdater: ((currVal: T) => T) | T): void {
  if (typeof valOrUpdater === 'function') {
    const updater = valOrUpdater as any;
    try {
      observable.value = updater(observable.value);
    } catch (e: any) {
      throw new Error(e.message);
    }
  } else {
    observable.value = valOrUpdater;
  }
}
