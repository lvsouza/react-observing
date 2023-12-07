import { v4 as uuid } from 'uuid';

import { ISubscription } from '../interfaces/ISubscription';
import { IObservable } from '../interfaces/IObservable';
import { IListeners } from '../interfaces/IListeners';
import { set } from './Set';

/** Subscribe in the observable and return their current state */
type TGetObservableValue = <O>(observable: IObservable<O>) => O;

/** Set a value to a observable */
type TSetObservableValue = <O>(observable: IObservable<O>, valueOrUpdater: ((currVal: O) => O) | O) => void;

type TSelectorGetterOptions = {
  /** Subscribe in the observable and return their current state */
  get: TGetObservableValue;
}

type TSelectorGetterSetterOptions = TSelectorGetterOptions & {
  /** Set a value to a observable state */
  set: TSetObservableValue;
}

export type TSelectorStateGetter<T> = (options: TSelectorGetterOptions) => T;
type TSelectorStateSetter<T> = (options: TSelectorGetterSetterOptions, newValue: T) => void;

type TReadOnlySelectorOptions<T> = {
  /** Selector accessor method get  */
  get: TSelectorStateGetter<T>;
}

type TReadWriteSelectorOptions<T> = TReadOnlySelectorOptions<T> & {
  /** Selector accessor method set  */
  set: TSelectorStateSetter<T>;
}

type TReadOnlySelectorState<T> = IObservable<T> & {
  readonly value: T;
};
type TReadWriteSelectorState<T> = IObservable<T>;

/**
 * Build a read and writable selector state
 */
export function selector<T>(props: TReadWriteSelectorOptions<T>): TReadWriteSelectorState<T>;
/**
 * Build a read only selector state
 */
export function selector<T>(props: TReadOnlySelectorOptions<T>): TReadOnlySelectorState<T>;
/**
 * Build a read only selector state
 */
export function selector<T>(props: TSelectorStateGetter<T>): TReadOnlySelectorState<T>;
/**
 * Build a read and writable selector state
 */
export function selector<T>(props: TReadWriteSelectorOptions<T>, dangerousOnUnused?: () => void): TReadWriteSelectorState<T>;
/**
 * Build a read only selector state
 */
export function selector<T>(props: TReadOnlySelectorOptions<T>, dangerousOnUnused?: () => void): TReadOnlySelectorState<T>;
/**
 * Build a read only selector state
 */
export function selector<T>(props: TSelectorStateGetter<T>, dangerousOnUnused?: () => void): TReadOnlySelectorState<T>;

export function selector<T>(props: TSelectorStateGetter<T> | TReadOnlySelectorOptions<T> | TReadWriteSelectorOptions<T>, dangerousOnUnused?: () => void): TReadOnlySelectorState<T> | TReadWriteSelectorState<T> {
  const setResolver = typeof props === 'object' ? (props as TReadWriteSelectorOptions<T>).set : undefined;
  const getResolver = typeof props === 'object' ? props.get : props;

  const storedListeners: IListeners<T>[] = [];
  const selectorId = uuid();

  /** Store subscriptions to unsubscribe */
  const observablesSubscribed: ISubscription[] = [];

  const getOnly = <O>(currObservable: IObservable<O>): O => {
    return currObservable.value;
  }

  const getAndSubscribe = (listToAddNewSubscriptions: ISubscription[]) => <O>(currObservable: IObservable<O>): O => {

    const subscriptionPosition = observablesSubscribed.findIndex(sub => sub.observerId === currObservable.id)
    const oldSubscription = observablesSubscribed.splice(subscriptionPosition, 1);
    if (subscriptionPosition > -1 && oldSubscription.length > 0) {
      listToAddNewSubscriptions.push(...oldSubscription);
      return currObservable.value;
    }

    /**
     * If you is not subscribed, then subscribe
     */
    const subscription = currObservable.subscribe(() => {
      const newSubscriptions: ISubscription[] = [];

      const value = getResolver({ get: getAndSubscribe(newSubscriptions) });

      // This logic help to remove unused subscriptions
      observablesSubscribed.forEach(subs => subs.unsubscribe());
      observablesSubscribed.splice(0);
      observablesSubscribed.push(...newSubscriptions);

      storedListeners.forEach((listener) => listener.emit(value));
    });

    /** Store subscription */
    listToAddNewSubscriptions.push(subscription);

    /**
     * Return the value
     */
    return currObservable.value;
  }

  /**
   * Creates the subscription for the value
   *
   * @param fn Function performed when the value changes
   */
  const subscribe = (fn: (val: T) => void): ISubscription => {
    const newListener = { id: uuid(), emit: fn };
    storedListeners.push(newListener);

    if (observablesSubscribed.length === 0) {
      getResolver({ get: getAndSubscribe(observablesSubscribed) });
    }

    return {
      id: newListener.id,
      observerId: selectorId,
      unsubscribe: () => {
        const indexToRemove = storedListeners.findIndex(listener => listener.id === newListener.id);
        if (indexToRemove >= 0) {
          storedListeners.splice(indexToRemove, 1);
        }

        if (storedListeners.length === 0) {
          observablesSubscribed.forEach(subs => subs.unsubscribe());
          observablesSubscribed.splice(0);
          setTimeout(() => {
            if (storedListeners.length === 0) {
              dangerousOnUnused?.();
            }
          }, 0);
        }
      }
    };
  };

  return {
    subscribe,
    id: selectorId,
    get value() {
      return getResolver({ get: getOnly });
    },
    set value(newValue: T) {
      if (setResolver) {
        setResolver({ get: getOnly, set }, newValue);
      } else {
        throw new Error('Set value is not allowed in read only selector state');
      }
    },
  };
}
