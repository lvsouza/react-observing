import { advancedSelector } from './AdvancedSelector';
import { observe } from './Observe';
import { set } from './Set';

describe('New readonly advanced selector', () => {
  const Store1 = observe(true);
  const Store2 = observe(false);

  const storeSelector = advancedSelector<string, number>({
    get: (number = 1) => ({ get }) => {
      const store1 = get(Store1);
      const store2 = get(Store2);

      return `${store1} - ${store2}: ${number}`;
    }
  });

  it('is "true - false: 1"', () => {
    expect(storeSelector(1).value).toBe('true - false: 1');
  });

  it('is "true - false: 1"', () => {
    try {
      set(storeSelector(1), '');
      expect(storeSelector(1).value).toBe('');
    } catch (error) {
      expect(storeSelector(1).value).toBe('true - false: 1');
    }
  });
});

describe('New readonly advanced selector with arrays', () => {
  const Store = observe([
    observe('1'),
    observe('2'),
    observe('3'),
    observe('4'),
  ]);

  const storeSelector = advancedSelector<string, number>({
    get: (multiplier = 1) => ({ get }) => {
      const items = get(Store);

      const wordCount = items.reduce((count, item) => count + get(item).length, 0);

      return `Word total: ${wordCount * multiplier}`;
    }
  });

  it('is "Word total: 8"', () => {
    expect(storeSelector(2).value).toBe('Word total: 8');
  });

  it('is "Word total: 10" in subscribe', () => {
    storeSelector(2).subscribe(value => expect(value).toBe('Word total: 10'));
    Store.value = [...Store.value, observe('5')];
  });
});

describe('New readwrite advanced selector', () => {
  const Store1 = observe(true);
  const Store2 = observe(true);
  const Store3 = observe('');

  const storeSelector = advancedSelector<string, string>({
    get: (more) => ({ get }) => {
      const store1 = get(Store1);
      const store2 = get(Store2);

      return `${store1} - ${store2} - ${more}`;
    },
    set: (more) => ({ set }, newValue) => {
      const [value1, value2] = newValue.split(' - ');

      set(Store1, value1 === 'true');
      set(Store2, value2 === 'true');
      set(Store3, more);
    }
  });

  it('is "true - true - more"', () => {
    expect(storeSelector('more').value).toBe('true - true - more');
  });

  it('is "false - false - boris"', () => {
    set(storeSelector('boris'), 'false - false');
    expect(storeSelector('boris').value).toBe('false - false - boris');
    expect(Store3.value).toBe('boris');
  });

  it('is "false - true - extra"', () => {
    set(storeSelector('extra'), 'false - true');
    expect(storeSelector('extra').value).toBe('false - true - extra');
    expect(Store3.value).toBe('extra');
  });

  it('is "true - true - popcorn"', () => {
    set(storeSelector('popcorn'), 'true - true');
    expect(storeSelector('popcorn').value).toBe('true - true - popcorn');
    expect(Store3.value).toBe('popcorn');
  });

  it('is "true - false - juice"', () => {
    set(storeSelector('juice'), 'true - false');
    expect(storeSelector('juice').value).toBe('true - false - juice');
    expect(Store3.value).toBe('juice');
  });
});
