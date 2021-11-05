import { observe, transform, useObserver } from 'react-observing'


const nameStore = observe('')

const nameTransformedStore = transform(
  nameStore,
  value => value.replaceAll('', '$'),
  value => value.replaceAll('$', '')
)


export const InputName = () => {
  const [transformedName, setTransformedName] = useObserver(nameTransformedStore);
  const [name, setName] = useObserver(nameStore);

  return (
    <div>
      <h1>Input name</h1>
      <p>Original: {name}</p>
      <p>Transformed: {transformedName}</p>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={transformedName} onChange={e => setTransformedName(e.target.value)} />
    </div>
  )
}
