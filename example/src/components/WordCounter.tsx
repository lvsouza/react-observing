import { observe, transform, useObserver, useObserverValue } from 'react-observing'

const textStore = observe('')

const textSizeStore = transform(textStore, text => text.length)

const Counter = () => {
  const textSize = useObserverValue(textSizeStore)

  return <p>Length {textSize}</p>
}

export const WordCounter = () => {
  const [text, setText] = useObserver(textStore)

  return (
    <>
      <h1>Word counter</h1>
      <Counter />
      <input value={text} onChange={e => setText(e.target.value)} />
    </>
  )
}