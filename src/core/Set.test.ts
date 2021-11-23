import { observe } from './Observe';
import { set } from './Set';

describe('Set observable prop', () => {
  const Store = observe(true);

  it('Can set observable prop to "false"', () => {
    set(Store, false);

    expect(Store.value).toBe(false);
  });

  it('Can set observable prop to "true"', () => {
    set(Store, (old) => !old);

    expect(Store.value).toBe(true);
  });
});
