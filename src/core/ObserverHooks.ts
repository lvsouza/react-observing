import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { IObservable, ISubscription } from './Observable'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `[value, setValue]` - Returns a react state that, when changed, rerender the component
 */
export function useObserver<T>(
  observable: IObservable<T>
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

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `setValue` - Returns a function that can be used to change the observable value
 */
export function useSetObserver<T>(
  observable: IObservable<T>
): (valOrUpdater: ((currVal: T) => T) | T) => void {
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

  return handleSetValue
}

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `value` - Returns a react state that, when changed, rerender the component
 */
export function useObserverValue<T>(observable: IObservable<T>): T {
  /**
   * Store the value subscription
   */
  const subscription = useRef<ISubscription | null>(null)
  const [value, setValue] = useState<T>(observable.value)

  useEffect(() => {
    subscription.current = observable.subscribe(setValue)
    return subscription.current.unsubscribe
  }, [observable])

  return value
}
