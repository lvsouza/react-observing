import { DependencyList, useMemo } from 'react';

import { TSelectorStateGetter, selector } from '../core/Selector';
import { useObserverValue } from './UseObserverValue';

/**
 * Allows you to create and subscribe to a new selector changes
 *
 * @param selectorGetValue - Function to get and transform the observables value
 * @param deps - List of variables that when changed recreate the selector function
 * @returns `value` - Returns a react state that, when changed, re render the component
 */
export function useSelectorValue<T>(selectorGetValue: TSelectorStateGetter<T>, deps: DependencyList): T {

  const selectorObservable = useMemo(() => {
    return selector(selectorGetValue);
  }, [...deps]);


  return useObserverValue(selectorObservable);
}
