import { useEffect, useReducer, useRef } from 'react';

import { IObservable } from './../interfaces/IObservable';

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `value` - Returns a react state that, when changed, rerender the component
 */
export function useObserverValue<T>(observable: IObservable<T>): T {
  const [, forceUpdate] = useReducer(() => [], []);

  const stateId = useRef<string>();

  useEffect(() => {
    if (stateId.current !== observable.id) {
      stateId.current = observable.id;
      forceUpdate();
    }

    const subscription = observable.subscribe(() => forceUpdate());

    return subscription.unsubscribe;
  }, [observable]);

  return observable.value;
}
