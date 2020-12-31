import { useCallback, useEffect, useRef, useState } from 'react'

// eslint-disable-next-line no-unused-vars
import { TSetObservableState } from '../types'
// eslint-disable-next-line no-unused-vars
import { IObservable } from './../interfaces'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `[value, setValue]` - Returns a react state that, when changed, rerender the component
 */
export function useObserver<T>(
  observable: IObservable<T>
): [T, TSetObservableState<T>] {
  const getValueState = useCallback((value: T): T | (() => T) => {
    if (typeof value === 'function') {
      return () => value
    } else {
      return value
    }
  }, [])

  const refId = useRef<string>()
  const [value, setValue] = useState<T>(getValueState(observable.value))

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

  /**
   * Change the value
   * @param valOrUpdater Value or function to update the value
   */
  const handleSetValue: TSetObservableState<T> = (
    valOrUpdater: ((currVal: T) => T) | T
  ) => {
    if (typeof valOrUpdater === 'function') {
      const updater = valOrUpdater as any
      try {
        observable.value = updater(getValueState(observable.value))
      } catch (e) {
        throw new Error(e)
      }
    } else {
      observable.value = valOrUpdater
    }
  }

  return [value, handleSetValue]
}
