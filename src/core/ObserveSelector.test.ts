import { observe } from './Observable';
import { selector } from './ObserveSelector';
import { set } from './Set';

describe('New readonly selector with arrow function', () => {
  const Store1 = observe(true);
  const Store2 = observe(false);

  const storeSelector = selector(({ get }) => {
    const store1 = get(Store1);
    const store2 = get(Store2);

    return `${store1} - ${store2}`;
  });

  it('is "true - false"', () => {
    expect(storeSelector.value).toBe('true - false');
  });

  it('is "true - false"', () => {
    try {
      set(storeSelector, '');
      expect(storeSelector.value).toBe('');
    } catch (error) {
      expect(storeSelector.value).toBe('true - false');
    }
  });
});

describe('New readonly selector', () => {
  const Store1 = observe(true);
  const Store2 = observe(false);

  const storeSelector = selector({
    get: ({ get }) => {
      const store1 = get(Store1);
      const store2 = get(Store2);

      return `${store1} - ${store2}`;
    }
  });

  it('is "true - false"', () => {
    expect(storeSelector.value).toBe('true - false');
  });

  it('is "true - false"', () => {
    try {
      set(storeSelector, '');
      expect(storeSelector.value).toBe('');
    } catch (error) {
      expect(storeSelector.value).toBe('true - false');
    }
  });
});

describe('New readwrite selector', () => {
  const Store1 = observe(true);
  const Store2 = observe(true);

  const storeSelector = selector<string>({
    get: ({ get }) => {
      const store1 = get(Store1);
      const store2 = get(Store2);

      return `${store1} - ${store2}`;
    },
    set: ({ set }, newValue) => {
      const [value1, value2] = newValue.split(' - ');

      set(Store1, value1 === 'true');
      set(Store2, value2 === 'true');
    }
  });

  it('is "true - true"', () => {
    expect(storeSelector.value).toBe('true - true');
  });

  it('is "false - false"', () => {
    set(storeSelector, 'false - false');
    setTimeout(() => {
      expect(storeSelector.value).toBe('false - false');
    }, 0);
  });

  it('is "false - true"', () => {
    set(storeSelector, 'false - true');
    setTimeout(() => {
      expect(storeSelector.value).toBe('false - true');
    }, 0);
  });

  it('is "true - true"', () => {
    set(storeSelector, 'true - true');
    setTimeout(() => {
      expect(storeSelector.value).toBe('true - true');
    }, 0);
  });

  it('is "true - false"', () => {
    set(storeSelector, 'true - false');
    setTimeout(() => {
      expect(storeSelector.value).toBe('true - false');
    }, 0);
  });
});
