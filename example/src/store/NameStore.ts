import { observe, selector, transform, TSelectorGetterSetterOptions } from "react-observing"

export const NameStore = observe([{
  show: observe(() => console.log('Try')),
  fistName: observe(""),
  lastName: observe(""),
  genre: observe(""),
  age: observe("")
}]);

export const TransformedNameStore = transform(NameStore, names => {
  return names.map(name => ({
    ...name,
    fistName: transform(
      name.fistName,
      value => value.split('').join('_'),
      value => value.replace(/_/g, '')
    ),
    lastName: transform(
      name.lastName,
      value => value.split('').join('_'),
      value => value.replace(/_/g, '')
    ),
    genre: transform(
      name.genre,
      value => value.split('').join('_'),
      value => value.replace(/_/g, '')
    ),
    age: transform(
      name.age,
      value => value.split('').join('_'),
      value => value.replace(/_/g, '')
    )
  }))
});

export const firstNameSelector = selector({
  get: ({ get }) => {
    const names = get(NameStore);

    const { length } = get(names[0].fistName);

    return length;
  }
});

export const lastNameSelector = selector(({ get }) => {
  const names = get(NameStore);

  const { length } = get(names[0].lastName);

  return length;
});

export const countNameSelector = selector<string>({
  get: ({ get }) => {
    const firstName = get(firstNameSelector);
    const lastName = get(lastNameSelector);

    return `${firstName} - ${lastName}`;
  },
  set: ({ get, set }: TSelectorGetterSetterOptions, newValue) => {
    const firstName = get(firstNameSelector);
    const lastName = get(lastNameSelector);

    console.log('firstName', firstName)
    console.log('lastName', lastName)
    console.log('newValue', newValue)

    const names = get(NameStore);

    set(names[0].fistName, 'iiiiii')

    console.log(set)
  }
});
