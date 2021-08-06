import { observe, selector, transform } from "react-observing"

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

    const { length } = get(names[0].fistName)
    console.log('fistName', length)

    return length;
  }
})

export const lastNameSelector = selector(({ get }) => {
  const names = get(NameStore);

  const { length } = get(names[0].lastName)
  console.log('lastName', length)

  return length;
})

export const countNameSelector = selector({
  get: ({ get }) => {
    const firstName = get(firstNameSelector);
    const lastName = get(lastNameSelector);

    return `${firstName} - ${lastName}`;
  },
})
