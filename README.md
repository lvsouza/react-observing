# react-observing

> Allow you observe objects and class in react js.

[![NPM](https://img.shields.io/npm/v/react-observing.svg)](https://www.npmjs.com/package/react-observing) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-observing
or
yarn add react-observing
```

## Usage

```tsx
import React from 'react';

import { observable, useObserver } from 'react-observing';

const NameStore = observable("My name")

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
