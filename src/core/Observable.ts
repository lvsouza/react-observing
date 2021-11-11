import { v4 as uuid } from 'uuid';

import { ISubscription } from './../interfaces/ISubscription';
import { IObservable } from './../interfaces/IObservable';
import { IListeners } from './../interfaces/IListeners';

/**
 * Allows us to subscribe to changes to a value
 * @param initialValue - `T` Default value
 * @returns IObservable<T> Observable
 */
export function observe<T>(initialValue: T): IObservable<T> {
  const storedListeners: IListeners<T>[] = [];
  const observerId = uuid();

  const setCurrentValue = (newValue: T) => {
    initialValue = newValue;
    storedListeners.forEach((listener) => listener.emit(newValue));
  };

  const getCurrentValue = () => initialValue;

  /**
   * Creates the subscription for the value
   *
   * @param fn Function performed when the value changes
   */
  const subscribe = (fn: (val: T) => void): ISubscription => {
    const newListener = { id: uuid(), emit: fn };
    storedListeners.push(newListener);

    return {
      observerId,
      id: newListener.id,
      unsubscribe: () => {
        const indexToRemove = storedListeners.findIndex(listener => listener.id === newListener.id);
        if (indexToRemove < 0) return;
        storedListeners.splice(indexToRemove, 1);
      }
    };
  };

  return {
    subscribe,
    id: observerId,
    get value() {
      return getCurrentValue();
    },
    set value(value: T) {
      setCurrentValue(value);
    }
  };
}
