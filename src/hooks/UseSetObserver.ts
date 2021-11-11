import { useCallback } from 'react';

import { TUpdater, TValueOrUpdater } from '../types/TValueOrUpdater';
import { TSetObservableState } from '../types/TSetObservableState';
import { IObservable } from './../interfaces/IObservable';

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `setValue` - Returns a function that can be used to change the observable value
 */
export function useSetObserver<T>(observable: IObservable<T>): TSetObservableState<T> {
  /**
   * Change the value
   * @param valOrUpdater Value or function to update the value
   */
  const handleSetValue: TSetObservableState<T> = useCallback((valOrUpdater: TValueOrUpdater<T>) => {
    if (typeof valOrUpdater === 'function') {
      const updater = valOrUpdater as TUpdater<T>;

      observable.value = updater(observable.value);
    } else {
      observable.value = valOrUpdater;
    }
  }, [observable.value]);

  return handleSetValue;
}
