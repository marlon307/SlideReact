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
  const [index, setIndex] = useState(1);
  const [startEv, setStartEv] = useState(false);
  const [finishPosition, setFinishPosition] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0)
  const [positonX, setPositionX] = useState(0);
  const [started, setStarted] = useState(false);

  function prev() {
    nextIndex(index - 1, true);
  }

  function next() {
    nextIndex(index + 1, true);
  }

  function nextIndex(nIndex: number, animate: boolean) {
    const getElementWidth = slideRef.current?.children[0].children[nIndex]!;
    if (getElementWidth === undefined) return;
    const calcnextIndex = -getElementWidth.clientWidth * nIndex;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
    setStarted(animate);
    setIndex(nIndex);
  }

  function finishEvent() {
    if (startEv) {
      if (positonX > finishPosition) prev();
      else next();
    }
    setStartEv(false);
  }

  function starEvent(event: { nativeEvent: { offsetX: React.SetStateAction<number>; }; }) {
    setStartEv(true);
    setInitpositinX(event.nativeEvent.offsetX);
  }

  useEffect(() => {
    const { current } = slideRef;
    const getMaxIndex = current?.children[0].children.length! - 1;

    function checkIndex() {
      if (index === 0) {
        nextIndex(getMaxIndex - 1, false);
      }
      if (index === getMaxIndex) {
        nextIndex(1, false);
      }
    }

    current?.addEventListener('transitionend', checkIndex);
    return () => {
      current?.removeEventListener('transitionend', checkIndex);
    }
  }, [index]);

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
      current?.removeEventListener('mouseleave', finishEvent);
    }
  }, [startEv, slideRef, initpositinX, finishPosition]);

  return (
    <>
      <div
        ref={ slideRef }
        className={ style.movePanel }
        onMouseDown={ starEvent }
        onMouseUp={ finishEvent }
        onMouseLeave={ finishEvent }
      >
        <div
          className={ `${style.slide}  ${startEv || !started && style.stopanimation}` }
          style={ {
            transform: `translate3D(${positonX}px, 0, 0)`,
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
