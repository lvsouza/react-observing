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

Observable object with other observable objects

```YAML
people # observable state
-- id # observable state
-- age # observable state
-- name # observable state
-- more
---- middleName # observable state
---- lastName # observable state
```

Simple component consuming a input observable prop

```TSX
const AgeComponent = ({ age }) => {
  const [ageState, setAgeState] = useObserver(age); // Observe the root state

  return (
    // This change will re-render just this component,
    // but in the original object the state will be updated as well.
    <input value={ageState} onChange={e => setAgeState(e.target.value)}/>
  );
}
```

Component observing the root observable object

```TSX
const MyComponente = () => {
  const [rootState, setRootState] = useObserver(people); // Observe the root state

  return (
    <div>
      <AgeComponent age={rootState.age} />

      // This click will rerender only "AgeComponent". This component will not be rendered.
      <button onClick={() => set(rootState.age, '')}>Clear age</button>
    </div>
  );
}
```

# Get started

## State build functions

|Function| Description|
|--|--|
|`observe`|Returns a new observable object a value|
|`transform`|Returns a new observable object from another observable object|
|`selector`|Returns a new observable object from other observable objects or list of observable objects|

## Custom react hooks to observe states

|Hook name| Description|
|--|--|
|`useObserver`|Returns a react state and set state from a observable object|
|`useObserverValue`|Returns a react state from a observable object|
|`useSetObserver`|Returns a react set state from a observable object|

## Extra functions

|Function| Description|
|--|--|
|`set`|Set a value to a observable object|
|`isObservableProp`|Returns is a object is observable|


# Usage

```tsx
import React from 'react';
import { observe, useObserver } from 'react-observing';

const NameStore = observe("My name")

export const App = () => {
    const [name, setName] = useObserver(NameStore)

    return (
        <label>
            {name}
            <input value={name} onChange={e => setName(e.target.value)} />
        </label>
    )
}

```

## License

MIT © [lvsouza](https://github.com/lvsouza)
