// eslint-disable-next-line no-unused-vars
import React, { ReactNode, Fragment } from 'react'

import { useObserver } from '../core/ObserverHooks'
// eslint-disable-next-line no-unused-vars
import { IObserver } from '../core/Observable'

/**
 * Props to Observer component
 */
interface IObserverProps<T> {
  /**
   * Value that will be observed
   */
  value: IObserver<T>
  /**
   * React childrens
   */
  children(state: T, setState: (state: T) => void): ReactNode
}

/**
 * Allows you to observe an observable value
 */
export function Observer<T>({ children, value: obs }: IObserverProps<T>) {
  const [value, setValue] = useObserver(obs)
  return <Fragment children={children(value, setValue)} />
}
