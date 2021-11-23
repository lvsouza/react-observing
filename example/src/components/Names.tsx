import { IObservable, set, observe, advancedSelector, transform, useObserver, useObserverValue } from 'react-observing'


const namesStore = observe([observe('')]);

const namesLengthStore = transform(namesStore, names => names.length);

const namesWordLengthAdvancedSelector = advancedSelector<number, number>({
  get: (multiplier = 1) => ({ get }) => {
    const items = get(namesStore);

    const length = items.reduce((count, name) => count += get(name).length, 0);

    return length * multiplier;
  }
});



const ItemsCount = () => {
  const namesLength = useObserverValue(namesLengthStore);
  return <p>(transform) Items count: {namesLength}</p>
}

const WordCount: React.FC<{ index?: number }> = ({ index }) => {
  const namesWordLength = useObserverValue(namesWordLengthAdvancedSelector(index || 1));
  return <p>(advanced selector) Words count in all items: {namesWordLength}</p>
}

const NameItem: React.FC<{ nameObservable: IObservable<string>, index: number }> = ({ nameObservable, index }) => {
  const [name, setName] = useObserver(nameObservable);

  return <li>
    <ItemsCount />
    <WordCount index={index} />
    <button onClick={() => set(namesStore, old => [...old.filter((_, i) => i !== (index - 2))])}>Remove</button>
    <input value={name} onChange={e => setName(e.target.value)} />
  </li>
}


export const NameList = () => {
  const [names, setNames] = useObserver(namesStore);

  return (
    <div>
      <h1>Names</h1>
      <ItemsCount />
      <WordCount />

      <button onClick={() => setNames([...names, observe('')])}>Add item</button>

      <ul>
        {names.map((name, index) => <NameItem key={name.id} index={index + 2} nameObservable={name} />)}
      </ul>
    </div>
  )
}
