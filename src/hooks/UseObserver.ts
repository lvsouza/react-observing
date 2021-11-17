import { useCallback, useEffect, useReducer, useRef } from 'react';

import { TUpdater, TValueOrUpdater } from '../types/TValueOrUpdater';
import { TSetObservableState } from '../types/TSetObservableState';
import { IObservable } from './../interfaces/IObservable';

/**
 * Allows you to subscribe to changes in observable variables
 *
 * @param observable Variable that can be observed
 * @returns `[value, setValue]` - Returns a react state that, when changed, re render the component
 */
export function useObserver<T>(observable: IObservable<T>): [T, TSetObservableState<T>] {
  const [, forceUpdate] = useReducer(() => [], []);

  const stateId = useRef<string>(observable.id);

  useEffect(() => {
    if (stateId.current !== observable.id) {
      stateId.current = observable.id;
      forceUpdate();
    }

    const subscription = observable.subscribe(() => forceUpdate());

    return subscription.unsubscribe;
  }, [observable.id]);

  /**
   * Change the value
   *
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

  return [observable.value, handleSetValue];
}
