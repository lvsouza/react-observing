import { TSerializableParam } from '../types';
import { selector } from './ObserveSelector';
import { IObservable } from '../interfaces';


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

type TSelectorStateGetterWithParams<T, P extends TSerializableParam> = (param: P) => TSelectorStateGetter<T>;
type TSelectorStateSetterWithParams<T, P extends TSerializableParam> = (param: P) => TSelectorStateSetter<T>;

type TReadOnlySelectorOptionsWithParams<T, P extends TSerializableParam> = {
  /** Selector accessor method get  */
  get: TSelectorStateGetterWithParams<T, P>;
}
type TReadWriteSelectorOptionsWithParams<T, P extends TSerializableParam> = TReadOnlySelectorOptionsWithParams<T, P> & {
  /** Selector accessor method set  */
  set: TSelectorStateSetterWithParams<T, P>;
}

type TReadOnlySelectorStateWithParams<T, P extends TSerializableParam> = (id: string, param: P) => IObservable<T>;
type TReadWriteSelectorStateWithParams<T, P extends TSerializableParam> = (id: string, param: P) => IObservable<T>;


export function selectorWithParams_UNSTABLE<T, P extends TSerializableParam>(options: TReadWriteSelectorOptionsWithParams<T, P>): TReadWriteSelectorStateWithParams<T, P>;
export function selectorWithParams_UNSTABLE<T, P extends TSerializableParam>(options: TReadOnlySelectorOptionsWithParams<T, P>): TReadOnlySelectorStateWithParams<T, P>;
export function selectorWithParams_UNSTABLE<T, P extends TSerializableParam>(options: TReadWriteSelectorOptionsWithParams<T, P> | TReadOnlySelectorOptionsWithParams<T, P>): TReadOnlySelectorStateWithParams<T, P> | TReadWriteSelectorStateWithParams<T, P> {
  const getResolver: (param: P) => TSelectorStateGetter<T> = typeof options === 'object' ? options.get : options;
  const setResolver: ((param: P) => TSelectorStateSetter<T>) | undefined = typeof options === 'object' ? (options as any).set : undefined;


  const observableSelectors: { [key: string]: IObservable<any> } = {};

  return (id: string, param: P) => {
    if (observableSelectors[id]) return observableSelectors[id];

    if (setResolver === undefined) {
      observableSelectors[id] = selector({
        get: getResolver(param),
      });
    } else {
      observableSelectors[id] = selector({
        get: getResolver(param),
        set: setResolver(param),
      });
    }

    return observableSelectors[id];
  };
}
