import { WordCounter } from './components/WordCounter';
import { InputName } from './components/InputNome';
import { TodoList } from './components/TodoList';
import { Counter } from './components/Counter';
import { NameList } from './components/Names';


export const Home = () => {

  return (
    <div>
      Componentes
      <hr />
      <WordCounter />
      <hr />
      <Counter />
      <hr />
      <InputName />
      <hr />
      <NameList />
      <hr />
      <TodoList />
      <hr />
    </div>
  );
}
