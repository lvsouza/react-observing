import { useState } from 'react';
import { observe, useObserver, useTransformValue } from 'react-observing';


const numbers = observe<number[]>([]);

export const UseTransformNumbersSum = () => {
  const [multiplier, setMultiplier] = useState(0);

  const [numbersValue, setNumbers] = useObserver(numbers);

  const sum = useTransformValue(numbers, value => {
    return (value.reduce((previous, current) => previous + current, 0) * multiplier)
  }, [multiplier]);


  return (
    <div>
      <h1>UseTransform - Numbers sum</h1>

      <p>numbers: {numbersValue.length}</p>
      <p>(transformed) sum: {sum}</p>

      <input
        type='number'
        value={multiplier}
        onChange={e => setMultiplier(Number(e.target.value))}
      />

      <button onClick={() => setNumbers(old => [...old, 5])}>Add</button>
    </div>
  );
};
