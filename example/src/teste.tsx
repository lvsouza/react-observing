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
