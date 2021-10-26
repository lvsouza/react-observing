/**
 * Defines the basic information that an event listener must have so that it can be properly notified and handled
 */
export interface IListeners<T> {
  /**
   * Listener identification
   */
  id: string;
  /**
   * Stores the function that should be executed when there is an observable value change
   */
  emit: (data: T) => void;
}
