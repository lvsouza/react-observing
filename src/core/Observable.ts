import { v4 as uuidv4 } from 'uuid'
/**
 * Result of an inscription on an observable
 */
export interface ISubscription {
  /**
   * Unique universal registration id
   */
  subscriptionId: string
  /**
   * Allows cancellation of registration in the observable
   */
  unsubscribe(): void
}
/**
 * Interface that defines an observable value
 *
 * @param T Observable value type
 */
export interface IObservable<T> {
  id: string
  /**
   * Static value.
   * When making an assignment on this property, all
   * subscribers to that amount will hear
   */
  value: T
  /**
   * Enables enrollment in value changes
   * @param callback Function performed when there is a change in the observable value
   */
  subscribe(callback: (val: T) => void): ISubscription
}
/**
 * Defines the basic information that an event listener must have so that it can be properly notified and handled
 */
export interface IListeners<T> {
  /**
   * Listener identification
   */
  id: string
  /**
   * Stores the function that should be executed when there is an observable value change
   */
  emit: (data: T) => void
}
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
 * @param value - `T` Value to assign to the observable
 * @returns void
 */
export function set<T>(observable: IObservable<T>, value: T) {
  observable.value = value
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
