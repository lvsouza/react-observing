import { IObservable, ISubscription } from '../interfaces';
import { observe } from './Observable';

interface ISelectorGetProps {
  get: <O>(observable: IObservable<O>) => O
}

type TSelectorGet<T> = (getProps: ISelectorGetProps) => T;

type TSelectorGetInlineProps<T> = TSelectorGet<T>;

type TSelectorGetProps<T> = {
  get: TSelectorGet<T>;
}

type TSelectorProps<T> = TSelectorGetProps<T> | TSelectorGetInlineProps<T>;

type TSelectorInstance<T> = IObservable<T>;

export function selector<T>(props: TSelectorGetProps<T>): TSelectorInstance<T>;
export function selector<T>(props: TSelectorGetInlineProps<T>): TSelectorInstance<T>;
export function selector<T>(props: TSelectorProps<T>): TSelectorInstance<T> {
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
    set value(value: T) {
      storedObservable.value = value;
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
