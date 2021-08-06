import { observe } from './Observable';

describe('New store', () => {
  const Store = observe(true);

  it('is "true"', () => {
    expect(Store.value).toBe(true);
  });

  it('is "false"', () => {
    Store.value = false;

    expect(Store.value).toBe(false);
  });
});
