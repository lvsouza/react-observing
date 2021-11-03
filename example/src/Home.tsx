import { InputName } from './components/InputNome';
import { TodoList } from './components/TodoList';
import { Counter } from './components/Counter';


export const Home = () => {

  return (
    <div>
      Componentes
      <hr />
      <Counter />
      <hr />
      <InputName />
      <hr />
      <TodoList />
      <hr />
    </div>
  );
}
