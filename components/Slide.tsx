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

  function prev() {
    nextIndex(index - 1);
  }

  function next() {
    nextIndex(index + 1);
  }

  function nextIndex(nIndex: number) {
    const getElementWidth = slideRef.current?.children[0].children[nIndex]!;
    if (getElementWidth === undefined) return;
    const calcnextIndex = -getElementWidth.clientWidth * nIndex;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
    setIndex(nIndex);
  }

  function finishEvent() {
    const { current } = slideRef;
    if (startEv) {
      if (positonX > finishPosition) prev();
      else next();
    }
    current?.classList.remove(style.stopanimation);
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
        nextIndex(getMaxIndex - 1);
      }
      if (index === getMaxIndex) {
        nextIndex(1);
      }
    }

    current?.addEventListener('transitionend', checkIndex);
    return () => {
      current?.removeEventListener('transitionend', checkIndex);
    }
  }, [index]);

  useEffect(() => {
    const { current } = slideRef;

    const eventMouseMove = (event: any) => {
      current?.children[0].classList.remove(style.stopanimation)
      const positionReset = event.layerX - initpositinX;
      setPositionX(finishPosition + positionReset);
    }

    if (startEv) {
      current?.classList.add(style.stopanimation);
      current?.addEventListener('mousemove', eventMouseMove);
    }
    else current?.removeEventListener('mousemove', eventMouseMove);

    return () => {
      current?.removeEventListener('mousemove', eventMouseMove);
      current?.removeEventListener('mouseleave', finishEvent);
    }
  }, [startEv, slideRef, initpositinX, finishPosition]);

  useEffect(() => {
    const getElement = slideRef.current?.children[0];
    const lastChild = getElement?.lastChild?.cloneNode(true)!;
    const firstChild = getElement?.firstChild?.cloneNode(true)!;
    getElement?.appendChild(firstChild);
    getElement?.insertBefore(lastChild, getElement.firstChild);
    setPositionX(-getElement?.clientWidth!);
    setFinishPosition(-getElement?.clientWidth!)
  }, []);

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
          className={ style.slide }
          style={ {
            transform: `translate3D(${positonX}px, 0, 0)`,
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
