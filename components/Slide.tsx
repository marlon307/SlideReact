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
  const [allowShift, setAllowShift] = useState(true);

  function prev() {
    nextIndex(index - 1, true);
  }

  function next() {
    nextIndex(index + 1, true);
  }

  function nextIndex(nIndex: number, animate: boolean) {
    setAllowShift(false);
    const getElementWidth = slideRef.current?.children[0].children[nIndex].clientWidth!;
    const calcnextIndex = -getElementWidth * nIndex;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
    setIndex(nIndex);
    setStarted(animate);
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
    const getElement = slideRef.current?.children[0];
    setPositionX(-getElement?.clientWidth!);
    const lastChild = getElement?.lastChild?.cloneNode(true)!;
    const firstChild = getElement?.firstChild?.cloneNode(true)!;
    getElement?.appendChild(firstChild);
    getElement?.insertBefore(lastChild, getElement.firstChild);
  }, []);

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
    const getMaxIndex = slideRef.current?.children[0].children.length! - 1;
    if (!allowShift) {
      if (index === 0) {
        nextIndex(getMaxIndex, false);
      }
      if (index === getMaxIndex) {
        nextIndex(1, false);
      }
    }
    setAllowShift(true);
  }, [allowShift])

  return (
    <>
      <div
        ref={ slideRef }
        className={ style.movePanel }
        onMouseDown={ starEvent }
        onMouseUp={ finishEvent }
      >
        <div
          className={ `${style.slide}  ${startEv || !started && style.stopanimation}` }
          style={ {
            transform: `translateX(${positonX}px)`,
          } }
        >
          { children }
        </div>
      </div>
      <button onClick={ prev }>Prev</button>
      <button onClick={ next }>Next</button>
      <button onClick={ () => nextIndex(2, true) }>Next index 2</button>
    </>
  )
}

export default Slide
