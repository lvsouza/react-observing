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
