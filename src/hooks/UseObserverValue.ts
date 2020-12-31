import { useCallback, useEffect, useRef, useState } from 'react'

// eslint-disable-next-line no-unused-vars
import { IObservable } from './../interfaces'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `value` - Returns a react state that, when changed, rerender the component
 */
export function useObserverValue<T>(observable: IObservable<T>): T {
  const getValueState = useCallback((value: T): T | (() => T) => {
    if (typeof value === 'function') {
      return () => value
    } else {
      return value
    }
  }, [])

  const refId = useRef<string>()
  const [value, setValue] = useState<T>(getValueState(observable.value))

  // typeof _onClick.value === 'function'

  useEffect(() => {
    if (refId.current !== observable.id && value !== observable.value) {
      refId.current = observable.id
      setValue(getValueState(observable.value))
    } else if (refId.current !== observable.id) {
      refId.current = observable.id
    }

    return observable.subscribe((value) => setValue(getValueState(value)))
      .unsubscribe
  }, [observable])

  return value
}
