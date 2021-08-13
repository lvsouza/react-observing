<p align="center">
  <img src="https://raw.githubusercontent.com/lvsouza/react-observing/master/src/assets/logo.png" width="150" alt="react-observing" />
  <h1 align="center">react-observing</h1>
</p>

> Allow you observe objects, objects inside others objects, list, list inside others lists or class properties in react.

 [![NPM](https://img.shields.io/npm/v/react-observing.svg)](https://www.npmjs.com/package/react-observing) [![JavaScript Style Guide](https://img.shields.io/npm/dm/react-observing.svg)](https://www.npmjs.com/package/react-observing) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-observing
or
yarn add react-observing
```

# Description

This library helps in managing complex states. Allowing you to create separate states for each property of an object that can be a state as well. This allows that within react a property's state can be updated without generating re-renders in other react components.

**Example**

Observable object with observable properties

```YAML
people # State
-- id # State
-- age # State
-- name # State
-- more # Not a state
---- middleName # State
---- lastName # Not a state
```


# Get started

## State build functions

> Here are functions that can create observable states

|Function|Description|
|--|--|
|`observe`|Returns a new observable object a value|
|`transform`|Returns a new observable object from another observable object|
|`selector`|Returns a new observable object from other observable objects or list of observable objects|

## Custom react hooks to observe states

> Here are hooks that can observe and change the values contained in observable objects.

|Hook name|Description|
|--|--|
|`useObserver`|Returns a react state and set state from a observable object|
|`useObserverValue`|Returns a react state from a observable object|
|`useSetObserver`|Returns a react set state from a observable object|

**Important:** *A hook can only observe an object of the observable type. That is, objects that can be `IObservable<...> | undefined` are not accepted. But objects like `IObservable<undefined>` can be accepted.*

## Extra functions

> These are auxiliary functions. Help to change values or even check if an object is observable

|Function|Description|
|--|--|
|`set`|Set a value to a observable object|
|`isObservableProp`|Returns if a object is a observable|

## Typing available for typescript

> Here are interfaces available in typescript

|name|Description|
|--|--|
|`IObservable<T>`|Representation of a observable object|
|`ITransformedObservable<K>`|Representation of a observable object derived from another observable object|
|`ISubscription`|Representation of a subscription|

## Understanding some details

1. A hook can only observe an object of the observable type. That is, objects that can be `IObservable<...> | undefined` are not accepted. But objects like `IObservable<undefined>` can be accepted.
1. An observable object has some properties inside it. Look:

    ```TS
    const myObservableState = observe('My state')

    // In this property, the current value can be retrieved, or even changed with a simple assignment.
    // An assignment reflects on all observers of the object.
    myObservableState.value // Current value

    // Contains a unique identifier for the observable
    myObservableState.id // Some uuid

    // Allows you to listen for any observable object's value change.
    // Returns some useful properties for unsubscription when needed.
    myObservableState.subscribe(value => console.log(value)) // { unsubscribe, observableId, id }
    ```

# Examples

Example 1 - *Similar to simple react states*

```tsx
import React from 'react';
import { observe, useObserver } from 'react-observing';

// Construct an observable
const NameStore = observe("My name")

export const App = () => {

    // Allow listen or change the observable value
    const [name, setName] = useObserver(NameStore)

    return (
        <label>
            {name}
            <input value={name} onChange={e => setName(e.target.value)} />
        </label>
    )
}
```

Example 2 - *Simple object with properties as state*

```tsx
import React from 'react';
import { observe, useObserver } from 'react-observing';

const PeopleStore = {
  firstName: observe(''),
  lastName: observe(''),
}

// First name custom input component
// This component will render in every input change
const FirstNameInput = () => {
    const [firstName, setFirstName] = useObserver(PeopleStore.firstName)
    return <input value={firstName} onChange={e => setFirstName(e.target.value)} />
}

// Last name custom input component
// This component will render in every input change
const LastNameInput = () => {
    const [lastName, setLastName] = useObserver(PeopleStore.lastName)
    return <input value={lastName} onChange={e => setLastName(e.target.value)} />
}

// This component will render only for the first time
export const App = () => {

    // When submitting the data, after changing the inputs, the data will be updated as they are observable.
    const handle = (e) => {
      e.preventDefault()

      console.log(PeopleStore.firstName.value) // Updated value you typed in inputs
      console.log(PeopleStore.lastName.value) // Updated value you typed in inputs
    }

    return (
      <form onSubmit={handle}>
          <FirstNameInput />
          <LastNameInput />

          <button>Submit</button>
      </form>
    )
}
```

Example 3 - *Array with objects with properties as state*

```tsx
import React from 'react';
import { observe, useObserver } from 'react-observing';

// Construct an observable list of objects with observable properties
const PeoplesStore = observe([
  {
    firstName: observe(''),
    lastName: observe(''),
  }
])

// First name custom input component
// This component will render in every input change
const FirstNameInput = ({ people }) => {
    const [firstName, setFirstName] = useObserver(people.firstName)
    return <input value={firstName} onChange={e => setFirstName(e.target.value)} />
}

// Last name custom input component
// This component will render in every input change
const LastNameInput = ({ people }) => {
    const [lastName, setLastName] = useObserver(people.lastName)
    return <input value={lastName} onChange={e => setLastName(e.target.value)} />
}

// This component will be rendered every time the number of items in the array is changed
export const App = () => {
    const [peoples, setPeoples] = useObserver(PeoplesStore)

    // When submitting the data, after changing the inputs, the data will be updated as they are observable.
    const handle = (e) => {
      e.preventDefault()

      people.forEach(people => {
        console.log(people.firstName.value) // Updated value you typed in inputs
        console.log(people.lastName.value) // Updated value you typed in inputs
      })
    }

    return (
      <form onSubmit={handle}>

          {peoples.map(people => (
            <div>
              <FirstNameInput people={people} />
              <LastNameInput people={people} />
            </div>
          ))}

          <button>Submit</button>
      </form>
    )
}
```

## License

MIT © [lvsouza](https://github.com/lvsouza)
