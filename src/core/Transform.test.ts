import { transform } from './Transform';
import { observe } from './Observable';

describe('New store', () => {
  const Store = observe(true);
  const TransformedStore = transform(
    Store,
    (value) => String(value),
    (value) => value === 'true'
  );

  it('is "true"', () => {
    expect(TransformedStore.value).toBe('true');
  });

  it('is "false"', () => {
    TransformedStore.value = 'false';

    expect(Store.value).toBe(false);
    expect(TransformedStore.value).toBe('false');
  });
});
