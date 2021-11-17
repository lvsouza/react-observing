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

  it('Add a valid subscription', () => {
    const subscription = Store.subscribe(() => { })

    expect(subscription.observerId).toBe(Store.id);
    expect(typeof subscription.observerId).toBe('string');
    expect(typeof subscription.unsubscribe).toBe('function');

    subscription.unsubscribe();
  });

  it('Subscribe and listen for value changes as "false"', () => {
    const subscription = Store.subscribe((value) => {
      expect(value).toBe(false);
    });

    Store.value = false;

    subscription.unsubscribe();
  });

  it('Subscribe and listen for value changes as "true"', () => {
    const subscription = Store.subscribe((value) => {
      expect(value).toBe(true);
    });

    Store.value = true;

    subscription.unsubscribe();
  });
});
