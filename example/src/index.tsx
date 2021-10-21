import React from 'react';
import ReactDOM from 'react-dom';

import { observe, useObserver } from 'react-observing';


const CounterStore = observe(0);

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
    <Counter />
  </React.StrictMode>,
  document.getElementById('root')
);
