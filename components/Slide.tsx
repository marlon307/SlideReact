import React, {
  ReactNode,
  createRef,
  useState,
  useCallback,
  useEffect,
  SetStateAction
} from 'react'
import style from './style.module.css'
type Props = {
  children: ReactNode
}

// Example https://codesandbox.io/s/remove-listener-with-callback-u4h22?file=/src/App.js

function Slide({ children }: Props) {

  const slideRef = createRef<HTMLDivElement>();
  const [startEv, setStartEv] = useState(false)
  const [positonX, setPositionX] = useState(0)
  const [initpositinX, setInitpositinX] = useState(0)

  const eventMouseMove = useCallback((event) => {
    setPositionX(event.offsetX)
  }, [])

  useEffect(() => {
    const { current } = slideRef;

    if (startEv) current?.addEventListener('mousemove', eventMouseMove)
    else current?.removeEventListener('mousemove', eventMouseMove)

    return () => {
      current?.removeEventListener('mousemove', eventMouseMove);
    }
  }, [startEv, eventMouseMove, slideRef]);

  function starEvent(event: { clientX: SetStateAction<number>; }) {
    setStartEv(true)
    setInitpositinX(event.clientX)
  }

  return (
    <div
      ref={ slideRef }
      className={ style.movePanel }
      onMouseDown={ starEvent }
      onMouseUp={ () => setStartEv(false) }
      onMouseLeave={ () => setStartEv(false) }
    >
      <div
        className={ style.slide }
        style={ { transform: `translateX(${positonX}px)` } }>
        { children }
      </div>
    </div>
  )
}

export default Slide
