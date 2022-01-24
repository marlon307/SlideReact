import React, {
  ReactNode,
  createRef,
  useState,
  useEffect,
} from 'react'
import style from './style.module.css';

type Props = {
  children: any;
}

function Slide({ children }: Props) {

  const slideRef = createRef<HTMLDivElement>();
  const [index, setIndex] = useState(1);
  const [startEv, setStartEv] = useState(false);
  const [finishPosition, setFinishPosition] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0)
  const [positonX, setPositionX] = useState(0);
  const [started, setStarted] = useState(false);

  function prev() {
    nextIndex(index - 1);
  }

  function next() {
    nextIndex(index + 1);
  }

  function nextIndex(nIndex: number) {
    const nextindex = slideRef.current?.children[0].children[nIndex].clientWidth!;
    const calcnextIndex = -nextindex * nIndex;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
    setIndex(nIndex);
    setStarted(true);
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

  useEffect(() => {
    setPositionX(-slideRef.current?.children[0]?.clientWidth!);
    const lastChild = slideRef.current?.children[0].lastChild?.cloneNode(true)!;
    const firstChild = slideRef.current?.children[0].firstChild?.cloneNode(true)!;
    slideRef.current?.children[0].appendChild(firstChild);
    slideRef.current?.children[0].insertBefore(lastChild, slideRef.current?.children[0].firstChild);
  }, [children]);

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
            transition: `${startEv || !started ? 'none' : '0.3s'}`
          } }
        >
          { children }
        </div>
      </div>
      <button onClick={ prev }>Prev</button>
      <button onClick={ next }>Next</button>
      <button onClick={ () => nextIndex(2) }>Next index 2</button>
    </>
  )
}

export default Slide
