import { v4 as uuidv4 } from 'uuid'

import {
  // eslint-disable-next-line no-unused-vars
  IListeners,
  // eslint-disable-next-line no-unused-vars
  IObservable,
  // eslint-disable-next-line no-unused-vars
  ISubscription,
  // eslint-disable-next-line no-unused-vars
  ITransformedObservable
} from './../interfaces'

/**
 * Allows us to subscribe to changes to a value
 * @param initialValue - `T` Default value
 * @returns IObservable<T> Observable
 */
export function transform<T, K>(
  observable: IObservable<T>,
  readTransformFunction: (currValue: T) => K,
  setTransformFunction?: (currValue: K) => T
): ITransformedObservable<K> {
  /**
   * Stores all listeners that must be notified that the value changes
   */
  const listeners: IListeners<K>[] = []

  /**
   * Returns the stored value
   */
  const getValue = () => readTransformFunction(observable.value)

  const setValue = (newValue: K) => {
    if (setTransformFunction) {
      observable.value = setTransformFunction(newValue)
    } else {
      throw new Error(
        'To use the "set" method, the "setTransformFunction" parameter of a "transform" needs to be informed'
      )
    }
  }

  /**
   * Creates the subscription for the value
   * @param fn Function performed when the value changes
   */
  const subscribe = (fn: (val: K) => void): ISubscription => {
    const newListener = { id: uuidv4(), emit: fn }
    listeners.push(newListener)

    return {
      id: newListener.id,
      unsubscribe: () => {
        const indexToRemove = listeners.indexOf(newListener)
        if (indexToRemove < 0) return
        listeners.splice(indexToRemove, 1)
      }
    }
  }

  observable.subscribe((newValue) => {
    listeners.forEach((listener) =>
      listener.emit(readTransformFunction(newValue))
    )
  })

  return {
    subscribe,
    id: uuidv4(),
    get value() {
      return getValue()
    },
    set value(newValue: K) {
      setValue(newValue)
    }
  }
}
