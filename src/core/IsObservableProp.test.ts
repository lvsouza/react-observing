import { isObservableProp } from './IsObservableProp'
import { observe } from './Observable'

describe('Is a observable prop', () => {
  const Store = observe(true)

  it('is a observable prop', () => {
    expect(isObservableProp(Store)).toBe(true)
  })

  it('is not a observable prop', () => {
    expect(isObservableProp(Store.value)).toBe(false)
  })
})
