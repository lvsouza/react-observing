import { useEffect, useState } from 'react'

// eslint-disable-next-line no-unused-vars
import { IObservable } from './../core'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `[value, setValue]` - Returns a react state that, when changed, rerender the component
 */
export function useObserver<T>(
  observable: IObservable<T>
): [T, (valOrUpdater: ((currVal: T) => T) | T) => void] {
  const [value, setValue] = useState<T>(observable.value)

  useEffect(() => {
    return observable.subscribe(setValue).unsubscribe
  }, [observable])

  /**
   * Change the value
   * @param valOrUpdater Value or function to update the value
   */
  const handleSetValue: (valOrUpdater: ((currVal: T) => T) | T) => void = (
    valOrUpdater: ((currVal: T) => T) | T
  ) => {
    if (typeof valOrUpdater === 'function') {
      const updater = valOrUpdater as any
      try {
        observable.value = updater(observable.value)
      } catch (e) {
        throw new Error(e)
      }
    } else {
      observable.value = valOrUpdater
    }
  }

  return [value, handleSetValue]
}
