/**
 * Result of an inscription on an observable
 */
export interface ISubscription {
  /**
   * Unique universal registration id
   */
  id: string
  /**
   * Allows cancellation of registration in the observable
   */
  unsubscribe(): void
}
