import { v4 as uuid } from 'uuid';

import { IListeners, IObservable, ISubscription, ITransformedObservable, ITransformedReadOnlyObservable } from './../interfaces';

/**
 * Allows us to subscribe to changes to a value
 * @param initialValue - `T` Default value
 * @returns IObservable<T> Observable
 */
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K): ITransformedReadOnlyObservable<K>;
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K, transformAndSetValue: (currValue: K) => T): ITransformedObservable<K>;
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K, transformAndSetValue?: (currValue: K) => T): ITransformedObservable<K> {
  const storedListeners: IListeners<K>[] = [];
  const transformId = uuid();

  observable.subscribe(newValue => {
    storedListeners.forEach(listener => listener.emit(transformAndGetValue(newValue)));
  });

  const setCurrentValue = (newValue: K) => {
    if (transformAndSetValue) {
      observable.value = transformAndSetValue(newValue);
    } else {
      throw new Error(
        'To use the "set" method, the "transformAndSetValue" parameter of a "transform" needs to be informed'
      );
    }
  };

  const getCurrentValue = () => transformAndGetValue(observable.value);

  /**
   * Creates the subscription for the value
   *
   * @param fn Function performed when the value changes
   */
  const subscribe = (fn: (val: K) => void): ISubscription => {
    const newListener = { id: uuid(), emit: fn };
    storedListeners.push(newListener);

    return {
      id: newListener.id,
      observerId: transformId,
      unsubscribe: () => {
        const indexToRemove = storedListeners.findIndex(listener => listener.id === newListener.id);
        if (indexToRemove < 0) return;
        storedListeners.splice(indexToRemove, 1);
      }
    };
  };

  return {
    subscribe,
    id: transformId,
    get value() {
      return getCurrentValue();
    },
    set value(newValue: K) {
      setCurrentValue(newValue);
    }
  };
}
