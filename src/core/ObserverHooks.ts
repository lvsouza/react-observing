import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { IObserver, ISubscription } from './Observable'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `[value, setValue]` - Returns a react state that, when changed, rerender the component
 */
export function useObserver<T>(
  observable: IObserver<T>
): [T, (valOrUpdater: ((currVal: T) => T) | T) => void] {
  /**
   * Store the value subscription
   */
  const subscription = useRef<ISubscription | null>(null)
  const [value, setValue] = useState<T>(observable.value)

  useEffect(() => {
    subscription.current = observable.subscribe(setValue)
    return subscription.current.unsubscribe
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
        observable.value = updater(value)
      } catch (e) {
        throw new Error(e)
      }
    } else {
      observable.value = valOrUpdater
    }
  }

  return [value, handleSetValue]
}
