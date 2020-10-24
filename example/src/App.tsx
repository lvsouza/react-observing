import React, { useCallback } from 'react'

import { IObserver, observable, useObserver, } from 'react-observing'
import { NameStore } from './store/NameStore'

const LastNameInput = ({ store }: { store: IObserver<string> }) => {
  const [name, setName] = useObserver(store);

  return (
    <>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
    </>
  )
}

const AgeInput = ({ store }: { store: IObserver<string> }) => {
  const [name, setName] = useObserver(store);

  return (
    <>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
    </>
  )
}

const GenreInput = ({ store }: { store: IObserver<string> }) => {
  const [name, setName] = useObserver(store);

  return (
    <>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
    </>
  )
}

const FistNameInput = ({ store }: { store: IObserver<string> }) => {
  const [name, setName] = useObserver(store);

  return (
    <>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
      <label>
        <li>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', borderColor: '#00000000' }} />
        </li>
      </label>
    </>
  )
}

export const App = () => {
  const [names, setnames] = useObserver(NameStore);

  const handleAdd = useCallback(() => {
    setnames(oldNames => {
      return [
        ...oldNames,
        {
          fistName: observable("My fist name"),
          lastName: observable("My last name"),
          genre: observable("My genere"),
          age: observable("My age"),
        }
      ];
    })
  }, [setnames]);

  return (
    <div>
      <hr />
      <button onClick={handleAdd}>Add</button>
      <hr />
      {names.map(store => (
        <>
          <FistNameInput store={store.fistName} />
          <ul>
            <hr />
            <LastNameInput store={store.lastName} />
            <hr />
            <AgeInput store={store.age} />
            <hr />
            <GenreInput store={store.genre} />
          </ul>
          <hr />
        </>))}
    </div>
  )
}
