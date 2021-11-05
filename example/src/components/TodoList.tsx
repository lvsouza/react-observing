import { IObservable, observe, selector, transform, useObserver, useObserverValue } from 'react-observing'


const todosStore = observe([
  observe(''),
]);

const todosLengthStore = transform(todosStore, todos => todos.length);

const todosWordLengthStore = selector({
  get: ({ get }) => {
    const items = get(todosStore);

    let length = 0;
    items.forEach((todo) => length += get(todo).length);

    return length;
  }
});



const ItemsCount = () => {
  const todosLength = useObserverValue(todosLengthStore);
  return <p>(transform) Items count: {todosLength}</p>
}

const WordCount = () => {
  const todosWordLength = useObserverValue(todosWordLengthStore);
  return <p>(selector) Words count in all items: {todosWordLength}</p>
}

const TodoItem: React.FC<{ todoObservable: IObservable<string> }> = ({ todoObservable }) => {
  const [todo, setTodo] = useObserver(todoObservable);

  return <li>
    <ItemsCount />
    <WordCount />
    <input value={todo} onChange={e => setTodo(e.target.value)} />
  </li>
}


export const TodoList = () => {
  const [todos, setTodos] = useObserver(todosStore);

  return (
    <div>
      <ItemsCount />
      <WordCount />

      <button onClick={() => setTodos([...todos, observe('')])}>Add item</button>

      <ul>
        {todos.map((todo, index) => <TodoItem key={index} todoObservable={todo} />)}
      </ul>
    </div>
  )
}
