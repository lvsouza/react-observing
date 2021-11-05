import { v4 as uuid } from 'uuid';

import { IObservable, ISubscription, IListeners } from '../interfaces';
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

type TSelectorStateGetter<T> = (options: TSelectorGetterOptions) => T;
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

export function selector<T>(props: TSelectorStateGetter<T> | TReadOnlySelectorOptions<T> | TReadWriteSelectorOptions<T>): TReadOnlySelectorState<T> | TReadWriteSelectorState<T> {
  const setResolver = typeof props === 'object' ? (props as TReadWriteSelectorOptions<T>).set : undefined;
  const getResolver = typeof props === 'object' ? props.get : props;

  const storedListeners: IListeners<T>[] = [];
  const selectorId = uuid();

  /** Store subscriptions to unsubscribe */
  const subscriptions: ISubscription[] = [];

  function getOnly<O>(currObservable: IObservable<O>): O {
    return currObservable.value;
  }

  function getAndSubscribe<O>(currObservable: IObservable<O>): O {
    /**
     * If you already is subscribed just return the value
     */
    if (subscriptions.some(sub => sub.observerId === currObservable.id)) {
      return currObservable.value;
    }

    /**
     * If you is not subscribed, then subscribe
     */
    const subscription = currObservable.subscribe(() => {
      const value = getResolver({ get: getAndSubscribe });
      storedListeners.forEach((listener) => listener.emit(value));
    });

    /** Store subscription */
    subscriptions.push(subscription);

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

    if (storedListeners.length === 1) {
      getResolver({ get: getAndSubscribe });
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
          subscriptions.forEach(subs => subs.unsubscribe());
          subscriptions.splice(0);
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
