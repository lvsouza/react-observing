import { WordCounter } from './components/WordCounter';
import { UseTransformNumbersSum } from './components/use-transform/UseTransformNumbersSum';
import { UseSelectorFullName } from './components/use-selector/UseSelectorFullName';
import { TransformInputName } from './components/TransformInputNome';
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
      <TransformInputName />
      <hr />
      <NameList />
      <hr />
      <TodoList />
      <hr />
      <UseTransformNumbersSum />
      <hr />
      <UseSelectorFullName />
      <hr />
    </div>
  );
}
