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
// https://medium.com/tinyso/how-to-create-the-responsive-and-swipeable-carousel-slider-component-in-react-99f433364aa0

function Slide({ children }: Props) {

  const slideRef = createRef<HTMLDivElement>();
  const [startEv, setStartEv] = useState(false);
  const [positonX, setPositionX] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventMouseMove = (event: { layerX: number; }) => {
    // setPositionX(initpositinX - event.offsetX)
    const positionReset = event.layerX - initpositinX - finishPosition;
    console.log(positionReset);

    setPositionX(positionReset + 1);
  }

  useEffect(() => {
    const { current } = slideRef;

    if (startEv) current?.addEventListener('mousemove', eventMouseMove)
    else current?.removeEventListener('mousemove', eventMouseMove)

    return () => {
      current?.removeEventListener('mousemove', eventMouseMove);
    }
  }, [startEv, eventMouseMove, slideRef]);

  function starEvent(event: { nativeEvent: { offsetX: React.SetStateAction<number>; }; }) {
    setStartEv(true)
    setInitpositinX(event.nativeEvent.offsetX);
  }

  function finishEvent(event) {
    setStartEv(false);
    console.log(event);
    setFinishPosition(finishPosition + event.clientX);
  }

  return (
    <div
      ref={ slideRef }
      className={ style.movePanel }
      onMouseDown={ starEvent }
      onMouseUp={ finishEvent }
      onMouseLeave={ finishEvent }
    >
      <div
        className={ style.slide }
        style={ { transform: `translateX(${positonX}px)` } }
      >
        { children }
      </div>
    </div>
  )
}

export default Slide
