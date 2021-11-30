import React, {
  ReactNode,
  createRef,
  useState,
  useEffect,
} from 'react'
import style from './style.module.css';

type Props = {
  children: ReactNode;
}

function Slide({ children }: Props) {

  const slideRef = createRef<HTMLDivElement>();
  const [startEv, setStartEv] = useState(false);
  const [positonX, setPositionX] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0);
  const [index, setIndex] = useState(1);

  function prev() {
    const nextindex = slideRef.current?.offsetWidth!;
    setIndex(index - 1);
    const calRight = nextindex + finishPosition;
    setPositionX(calRight);
    setFinishPosition(calRight);

  }

  // const teste = [0, 1, 2, 4]
  // teste.splice(2, 0, "Lene");

  // console.log(teste);

  function next() {
    const nextindex = slideRef.current?.offsetWidth!;
    setIndex(index + 1);
    const calcLeft = -nextindex * index;
    setPositionX(calcLeft);
    setFinishPosition(calcLeft)
  }

  function finishEvent() {
    setStartEv(false);
    if (positonX > finishPosition) prev();
    else next();
  }

  function starEvent(event: { nativeEvent: { offsetX: React.SetStateAction<number>; }; }) {
    setStartEv(true);
    setInitpositinX(event.nativeEvent.offsetX);
  }

  useEffect(() => {
    const { current } = slideRef;

    const eventMouseMove = (event: any) => {
      const positionReset = event.layerX - initpositinX;
      setPositionX(finishPosition + positionReset);
    }

    if (startEv) current?.addEventListener('mousemove', eventMouseMove);
    else current?.removeEventListener('mousemove', eventMouseMove);

    return () => {
      current?.removeEventListener('mousemove', eventMouseMove);
    }
  }, [startEv, slideRef, initpositinX, finishPosition]);

  return (
    <>
      <div
        ref={ slideRef }
        className={ style.movePanel }
        onMouseDown={ starEvent }
        onMouseUp={ finishEvent }
      >
        <div
          className={ style.slide }
          style={ {
            transform: `translateX(${positonX}px)`,
            transition: `${startEv ? 'none' : '0.3s'}`
          } }
        >
          { children }
        </div>
      </div>
      <button onClick={ prev }>Prev</button>
      <button onClick={ next }>Next</button>
    </>
  )
}

export default Slide
