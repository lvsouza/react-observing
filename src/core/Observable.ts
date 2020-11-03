import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line no-unused-vars
import { IListeners, IObservable, ISubscription } from './interfaces'

/**
 * Allows us to subscribe to changes to a value
 * @param initialValue - `T` Default value
 * @returns IObservable<T> Observable
 */
export function observe<T>(initialValue: T): IObservable<T> {
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
      subscriptionId: newListener.id,
      unsubscribe: () => {
        const indexToRemove = listeners.indexOf(newListener)
        if (indexToRemove < 0) return
        listeners.splice(indexToRemove, 1)
      }
    }
  }

  return {
    subscribe,
    id: uuidv4(),
    get value() {
      return getValue()
    },
    set value(value: T) {
      setValue(value)
    }
  }
}
/**
 * Allows you to assign values to observables
 * @param observable - `IObserver<T>` Observable to assign a value
 * @param valOrUpdater Value or function to update the value
 * @returns void
 */
export function set<T>(
  observable: IObservable<T>,
  valOrUpdater: ((currVal: T) => T) | T
): void {
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
/**
 * Valide if a propertie is observable
 * @param prop any Value to validate
 * @returns boolean
 */
export function isObservableProp(prop: any): boolean {
  return (
    prop?.subscribe !== undefined &&
    prop?.subscribe !== null &&
    prop?.id !== undefined &&
    prop?.id !== null
  )
}
