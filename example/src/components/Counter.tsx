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
const GetSetCounter = () => {
  const [counter, setCounter] = useObserver(CounterStore);

  return (
    <button
      onClick={() => setCounter(old => ++old)}
    >Somar {counter}</button>
  )
}

export const Counter = () => {
  return (
    <div>
      <h1>Counter</h1>
      <SetCounter />
      <GetSetCounter />
    </div>
  )
}
