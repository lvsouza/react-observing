import React, { Fragment, useCallback } from 'react'

import { IObservable, observe, useObserver, useObserverValue, useSetObserver, set } from 'react-observing'
import { NameStore, TransformedNameStore } from './store/NameStore'

const LastNameInput = ({ store }: { store: IObservable<string> }) => {
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

const AgeInput = ({ store }: { store: IObservable<string> }) => {
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

const GenreInput = ({ store }: { store: IObservable<string> }) => {
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

const FistNameInput = ({ store }: { store: IObservable<string> }) => {
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

const ShowButton = ({ store }: { store: IObservable<() => void> }) => {
  const show = useObserverValue(store);

  return (
    <button onClick={show}>
      Show
    </button>
  )
}

export const App = () => {
  const transformedNames = useObserverValue(TransformedNameStore);
  const setNames = useSetObserver(NameStore);
  const names = useObserverValue(NameStore);

  const handleInitState = useCallback(() => {
    names.forEach(({ age, fistName, genre, lastName }) => {
      set(fistName, "First name");
      set(lastName, "Last name");
      set(genre, "Genre");
      set(age, "Age");
    });
  }, [names]);
  handleInitState();

  const handleAdd = useCallback(() => {
    setNames(oldNames => {
      return [
        ...oldNames,
        {
          show: observe(() => console.log('Try')),
          fistName: observe(""),
          lastName: observe(""),
          genre: observe(""),
          age: observe(""),
        }
      ];
    })
  }, [setNames]);

  return (
    <div>
      <hr />
      <button onClick={handleAdd}>Add</button>
      <hr />
      {names.map((store, index) => (
        <Fragment key={index}>
          <FistNameInput store={store.fistName} />
          <ul>
            <hr />
            <LastNameInput store={store.lastName} />
            <hr />
            <AgeInput store={store.age} />
            <hr />
            <GenreInput store={store.genre} />
            <hr />
            <ShowButton store={store.show} />
          </ul>
          <hr />
        </Fragment>))}
      {transformedNames.map((store, index) => (
        <Fragment key={index}>
          <FistNameInput store={store.fistName} />
          <ul>
            <hr />
            <LastNameInput store={store.lastName} />
            <hr />
            <AgeInput store={store.age} />
            <hr />
            <GenreInput store={store.genre} />
            <hr />
            <ShowButton store={store.show} />
          </ul>
          <hr />
        </Fragment>))}
    </div>
  )
}
