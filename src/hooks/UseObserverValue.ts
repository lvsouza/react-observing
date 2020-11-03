import { useEffect, useState } from 'react'

// eslint-disable-next-line no-unused-vars
import { IObservable } from './../interfaces'

/**
 * Allows you to subscribe to changes in observable variables
 * @param observable Variable that can be observed
 * @returns `value` - Returns a react state that, when changed, rerender the component
 */
export function useObserverValue<T>(observable: IObservable<T>): T {
  const [value, setValue] = useState<T>(observable.value)

  useEffect(() => observable.subscribe(setValue).unsubscribe, [observable])

  return value
}
