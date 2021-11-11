// eslint-disable-next-line no-unused-vars
import { TUpdater, TValueOrUpdater } from '../types/TValueOrUpdater';
import { IObservable } from '../interfaces/IObservable';

/**
 * Allows you to assign values to observables
 *
 * @param observable - `IObserver<T>` Observable to assign a value
 * @param valOrUpdater Value or function to update the value
 * @returns void
 */
export function set<T>(observable: IObservable<T>, valOrUpdater: TValueOrUpdater<T>): void {
  if (typeof valOrUpdater === 'function') {
    const updater = valOrUpdater as TUpdater<T>;

    try {
      observable.value = updater(observable.value);
    } catch (e: any) {
      throw new Error(e.message);
    }
  } else {
    observable.value = valOrUpdater;
  }
}
