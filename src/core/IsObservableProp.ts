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
