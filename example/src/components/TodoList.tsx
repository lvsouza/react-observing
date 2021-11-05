import { IObservable, observe, selector, transform, useObserver, useObserverValue } from 'react-observing'


const todosStore: IObservable<IObservable<string>[]> = observe([
  observe(''),
]);

const todosLengthStore = transform(todosStore, todos => todos.length);

const todosWordLengthStore = selector({
  get: ({ get }) => {
    const items = get(todosStore);

    const length = items.reduce((count, todo) => count += get(todo).length, 0);

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

const Input: React.FC<{ todoObservable: IObservable<string> }> = ({ todoObservable }) => {
  const [todo, setTodo] = useObserver(todoObservable);
  return <input value={todo} onChange={e => setTodo(e.target.value)} />
}

const TodoItem: React.FC<{ todoObservable: IObservable<string>, onRemove: () => void }> = ({ todoObservable, onRemove }) => {
  return <li>
    {/* <ItemsCount />
    <WordCount /> */}
    <button onClick={onRemove}>Remove</button>
    <Input todoObservable={todoObservable} />
  </li>
}


export const TodoList = () => {
  const [todos, setTodos] = useObserver(todosStore);

  return (
    <div>
      <h1>Todo list</h1>

      <ItemsCount />
      <WordCount />

      <button onClick={() => setTodos(old => [...old, observe('')])}>Add item</button>

      <ul>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todoObservable={todo}
            onRemove={() => setTodos(old => [...old.filter((_, i) => i !== index)])}
          />
        ))}
      </ul>
    </div>
  )
}
