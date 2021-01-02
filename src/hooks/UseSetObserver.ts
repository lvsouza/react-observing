// eslint-disable-next-line no-unused-vars
import { useCallback } from 'react'
// eslint-disable-next-line no-unused-vars
import { TSetObservableState } from '../types'
// eslint-disable-next-line no-unused-vars
import { IObservable } from './../interfaces'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `setValue` - Returns a function that can be used to change the observable value
 */
export function useSetObserver<T>(
  observable: IObservable<T>
): TSetObservableState<T> {
  const getValueState = useCallback((value: T): T | (() => T) => {
    if (typeof value === 'function') {
      return () => value
    } else {
      return value
    }
  }, [])

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

  return handleSetValue
}
