import crypto from 'crypto';

import { ITransformedObservable, ITransformedReadOnlyObservable } from './../interfaces/ITransformedObservable';
import { ISubscription } from './../interfaces/ISubscription';
import { IObservable } from './../interfaces/IObservable';

/**
 * Allows us to subscribe to other observable changes
 *
 * @param observable - Observable to transform
 * @param transformAndGetValue - Function to get and transform the observable value
 * @returns ITransformedReadOnlyObservable<K>
 */
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K): ITransformedReadOnlyObservable<K>;
/**
 * Allows us to subscribe to other observable changes
 *
 * @param observable - Observable to transform
 * @param transformAndGetValue - Function to get and transform the observable value
 * @param transformAndSetValue - Function to transform and set the observable value
 * @returns ITransformedObservable<K>
 */
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K, transformAndSetValue: (currValue: K) => T): ITransformedObservable<K>;
export function transform<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K, transformAndSetValue?: (currValue: K) => T): ITransformedObservable<K> {
  const transformId = crypto.randomUUID();

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
    const subscription = observable.subscribe(value => fn(transformAndGetValue(value)));

    return {
      id: subscription.id,
      observerId: transformId,
      unsubscribe: subscription.unsubscribe,
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
