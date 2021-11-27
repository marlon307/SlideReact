import React, {
  ReactNode,
  createRef,
  useState,
  useEffect,
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
  const [finishPosition, setFinishPosition] = useState(0)
  const [initpositinX, setInitpositinX] = useState(0);
  const [index, setIndex] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventMouseMove = (event: any) => {
    const positionReset = event.layerX - initpositinX;
    if (positonX < finishPosition) {
      setPositionX(finishPosition + positionReset + 1);
    } else {
      setPositionX(finishPosition + positionReset - 1);
    }
  }

  function starEvent(event: { nativeEvent: { offsetX: React.SetStateAction<number>; }; }) {
    setStartEv(true)
    setInitpositinX(event.nativeEvent.offsetX);
  }

  function finishEvent() {
    setStartEv(false);
    const nextindex = slideRef.current?.offsetWidth!;

    if (positonX > finishPosition) {
      setIndex(index - 1);
      const calRight = nextindex + finishPosition;
      setPositionX(calRight);
      setFinishPosition(calRight);
      console.log(calRight, 'right');
    } else {
      setIndex(index + 1);
      const calcLeft = -nextindex * index;
      setPositionX(calcLeft);
      setFinishPosition(calcLeft)
      console.log(calcLeft, 'left');
    }
  }

  useEffect(() => {
    const { current } = slideRef;

    if (startEv) current?.addEventListener('mousemove', eventMouseMove);
    else current?.removeEventListener('mousemove', eventMouseMove);

    return () => {
      current?.removeEventListener('mousemove', eventMouseMove);
    }
  }, [startEv, eventMouseMove, slideRef]);

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
