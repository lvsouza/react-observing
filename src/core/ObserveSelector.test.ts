import { selector } from './ObserveSelector';
import { observe } from './Observable';
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

describe('New readonly selector with arrays', () => {
  const Store = observe([
    observe('1'),
    observe('2'),
    observe('3'),
    observe('4'),
  ]);

  const storeSelector = selector({
    get: ({ get }) => {
      const items = get(Store);

      const wordCount = items.reduce((count, item) => count + get(item).length, 0);

      return `Word total: ${wordCount}`;
    }
  });

  it('is "Word total: 4"', () => {
    expect(storeSelector.value).toBe('Word total: 4');
  });

  it('is "Word total: 5" in subscribe', () => {
    storeSelector.subscribe(value => expect(value).toBe('Word total: 5'));
    Store.value = [...Store.value, observe('5')];
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
    expect(storeSelector.value).toBe('false - false');
  });

  it('is "false - true"', () => {
    set(storeSelector, 'false - true');
    expect(storeSelector.value).toBe('false - true');
  });

  it('is "true - true"', () => {
    set(storeSelector, 'true - true');
    expect(storeSelector.value).toBe('true - true');
  });

  it('is "true - false"', () => {
    set(storeSelector, 'true - false');
    expect(storeSelector.value).toBe('true - false');
  });
});
