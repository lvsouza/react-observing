import { IObservable, ISubscription } from '../interfaces';
import { observe } from './Observable';

/** Subscribe in the observable and return their current state */
type TGetObservableValue = <O>(observable: IObservable<O>) => O;

type TSelectorGetterOptions = {
  /** Subscribe in the observable and return their current state */
  get: TGetObservableValue;
}

type TSelectorGetter<T> = (options: TSelectorGetterOptions) => T;

type TSelectorGetterProps<T> = {
  /** Accessor method get  */
  get: TSelectorGetter<T>;
}

type TSelectorProps<T> = TSelectorGetterProps<T> | TSelectorGetter<T>;

type TReadOnlySelectorState<T> = IObservable<T>;

export function selector<T>(props: TSelectorGetter<T>): TReadOnlySelectorState<T>;
export function selector<T>(props: TSelectorGetterProps<T>): TReadOnlySelectorState<T>;
export function selector<T>(props: TSelectorProps<T>): TReadOnlySelectorState<T> {
  /** Get getResolver function */
  const getResolver = typeof props === 'object' ? props.get : props;

  /** Store subscriptions to unsubscribe */
  const subscriptions: ISubscription[] = [];

  /** Store the calculated value */
  const storedObservable = observe(getResolver({ get: getAndSubscribe }));

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
    set value(_: T) {
      throw new Error('Set value is not allowed in read only selector state');
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
