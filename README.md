<p align="center">
  <img src="https://raw.githubusercontent.com/lvsouza/react-observing/master/src/assets/logo.png" width="150" alt="react-observing" />
  <h1 align="center">react-observing</h1>
</p>

> Allow you observe objects, objects inside others objects, list, list insede others lists or class properties in react.

[![NPM](https://img.shields.io/npm/v/react-observing.svg)](https://www.npmjs.com/package/react-observing) [![JavaScript Style Guide](https://img.shields.io/npm/dm/react-observing.svg)](https://www.npmjs.com/package/react-observing) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-observing
or
yarn add react-observing
```

## Usage

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

## React hooks

* `useObserver` - returns a react state and set state
* `useObserverValue` - returns a react state
* `useSetObserver` - returns a react set state

## License

MIT © [lvsouza](https://github.com/lvsouza)
