import { IObservable, ISubscription } from '../interfaces';
import { observe } from './Observable';
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
  set?: TSelectorStateSetter<T>;
}

type TReadWriteSelectorOptions<T> = TReadOnlySelectorOptions<T> & {
  /** Selector accessor method set  */
  set: TSelectorStateSetter<T>;
}

type TReadOnlySelectorState<T> = IObservable<T>;
type TReadWriteSelectorState<T> = IObservable<T>;

/**
 * Build a read only selector state
 */
export function selector<T>(props: TSelectorStateGetter<T>): TReadOnlySelectorState<T>;
/**
 * Build a read only selector state
 */
export function selector<T>(props: TReadOnlySelectorOptions<T>): TReadOnlySelectorState<T>;
/**
 * Build a read and writable selector state
 */
export function selector<T>(props: TReadWriteSelectorOptions<T>): TReadWriteSelectorState<T>;

export function selector<T>(props: TSelectorStateGetter<T> | TReadOnlySelectorOptions<T> | TReadWriteSelectorOptions<T>): TReadOnlySelectorState<T> | TReadWriteSelectorState<T> {
  const getResolver: TSelectorStateGetter<T> = typeof props === 'object' ? props.get : props;
  const setResolver: TSelectorStateSetter<T> = typeof props === 'object' ? (props as any).set : undefined;

  /** Store subscriptions to unsubscribe */
  const subscriptions: ISubscription[] = [];

  /** Store the calculated value */
  const storedObservable: IObservable<T> = observe<T>(getResolver({ get: getAndSubscribe }));

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
      setTimeout(() => storedObservable.value = value, 0);
    });

    /** Store subscription */
    subscriptions.push(subscription);

    /**
     * Return the value
     */
    return currObservable.value;
  }

  return {
    ...storedObservable,
    get value() {
      return storedObservable.value;
    },
    set value(newValue: T) {
      if (setResolver) {
        setResolver({ get: (obs: any) => obs.value, set }, newValue);
      } else {
        throw new Error('Set value is not allowed in read only selector state');
      }
    },
    subscribe: (callback: (val: T) => void) => {
      const subscription = storedObservable.subscribe(callback);
      return {
        ...subscription,
        unsubscribe: () => {
          subscriptions.forEach(sub => sub.unsubscribe());
          subscription.unsubscribe();
        }
      };
    }
  };
}
