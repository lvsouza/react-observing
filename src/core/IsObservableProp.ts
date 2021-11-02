/**
 * Valide if a property is observable
 * @param prop any Value to validate
 * @returns boolean
 */
export function isObservableProp(prop: any): boolean {
  return (
    typeof prop === 'object' &&
    typeof prop?.id === 'string' &&
    typeof prop?.subscribe === 'function'
  );
}
