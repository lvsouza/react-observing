import React from 'react';
import ReactDOM from 'react-dom';

import { observe, useObserver, useSetObserver } from 'react-observing';


const CounterStore = observe(0);

const SetCounter = () => {
  const setCounter = useSetObserver(CounterStore);

  return (
    <button onClick={() => setCounter(old => ++old)}>
      Somar
    </button>
  );
}
const Counter = () => {
  const [counter, setCounter] = useObserver(CounterStore);

  return (
    <button
      onClick={() => setCounter(old => ++old)}
    >Somar {counter}</button>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <SetCounter />
    <Counter />
  </React.StrictMode>,
  document.getElementById('root')
);
