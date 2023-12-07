import { DependencyList, useMemo } from 'react';

import { IObservable } from './../interfaces/IObservable';
import { useObserverValue } from './UseObserverValue';
import { transform } from '../core/Transform';

/**
 * Allows you to create and subscribe to a new transform changes
 *
 * @param observable Variable that can be observed
 * @param transformAndGetValue - Function to get and transform the observable value
 * @param deps - List of variables that when changed recreate the transform function
 * @returns `value` - Returns a react state that, when changed, re render the component
 */
export function useTransformValue<T, K>(observable: IObservable<T>, transformAndGetValue: (currValue: T) => K, deps: DependencyList): K {

  const transformObservable = useMemo(() => {
    return transform(observable, transformAndGetValue);
  }, [observable, ...deps]);


  return useObserverValue(transformObservable);
}
