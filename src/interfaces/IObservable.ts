import { ISubscription } from './ISubscription';

/**
 * Interface that defines an observable value
 *
 * @param T Observable value type
 */
export interface IObservable<T> {
  id: string;
  /**
   * Static value.
   * When making an assignment on this property, all
   * subscribers to that amount will hear
   */
  value: T;
  /**
   * Enables enrollment in value changes
   * @param callback Function performed when there is a change in the observable value
   */
  subscribe(callback: (val: T) => void): ISubscription;
}
