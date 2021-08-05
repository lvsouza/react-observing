import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line no-unused-vars
import { IListeners, IObservable, ISubscription } from './../interfaces'

/**
 * Allows us to subscribe to changes to a value
 * @param initialValue - `T` Default value
 * @returns IObservable<T> Observable
 */
export function observe<T>(initialValue: T): IObservable<T> {
  const observerId = uuidv4();

  /**
   * Stores all listeners that must be notified that the value changes
   */
  const listeners: IListeners<T>[] = []

  /**
   * Allows changing the stored value and notifying all listeners
   * @param newValue New value to be stored
   */
  const setValue = (newValue: T) => {
    initialValue = newValue
    listeners.forEach((listener) => listener.emit(newValue))
  }

  /**
   * Returns the stored value
   */
  const getValue = () => initialValue

  /**
   * Creates the subscription for the value
   * @param fn Function performed when the value changes
   */
  const subscribe = (fn: (val: T) => void): ISubscription => {
    const newListener = { id: uuidv4(), emit: fn }
    listeners.push(newListener)

    return {
      observerId,
      id: newListener.id,
      unsubscribe: () => {
        const indexToRemove = listeners.indexOf(newListener)
        if (indexToRemove < 0) return
        listeners.splice(indexToRemove, 1)
      }
    }
  }

  return {
    subscribe,
    id: observerId,
    get value() {
      return getValue()
    },
    set value(value: T) {
      setValue(value)
    }
  }
}
