import React, {
  ReactNode,
  useState,
  useEffect,
} from 'react';
import windowSize from '../hooks/useWindowSize';
import style from './style.module.css';

type Props = {
  children: ReactNode;
  refCarousel: { current: HTMLDivElement | null }
}

function Slide({ children, refCarousel }: Props) {
  const resizeWindow = windowSize();
  const [index, setIndex] = useState(1);
  const [startEv, setStartEv] = useState(false);
  const [finishPosition, setFinishPosition] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0)
  const [positonX, setPositionX] = useState(0);
  const [finishTransition, setFinishTransition] = useState(false);

  function nextIndex(nIndex: number, animate: boolean) {
    index !== nIndex && setFinishTransition(true);
    const getElementWidth = refCarousel.current?.children[0].children[nIndex]!;
    if (getElementWidth === undefined) return;
    const calcnextIndex = -getElementWidth.clientWidth * nIndex;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
    setIndex(nIndex);
    animate && refCarousel?.current?.classList.remove(style.stopanimation);
  }

  function finishEvent() {
    if (startEv) {
      positonX > finishPosition ? nextIndex(index - 1, true) : nextIndex(index + 1, true);
      setStartEv(false);
    }
  }

  function starEvent(event: { nativeEvent: { offsetX: React.SetStateAction<number>; }; }) {
    if (!startEv && !finishTransition) {
      setInitpositinX(event.nativeEvent.offsetX);
      setStartEv(true);
      setFinishTransition(true);
    }
  }

  useEffect(() => {
    const { current } = refCarousel;
    const getMaxIndex = current?.children[0].children.length! - 1;

    function checkIndex() {
      if (index === 0) {
        current?.classList.add(style.stopanimation);
        nextIndex(getMaxIndex - 1, false);
      }
      if (index === getMaxIndex) {
        current?.classList.add(style.stopanimation);
        nextIndex(1, false);
      }
      setFinishTransition(false);
    }

    current?.addEventListener('transitionend', checkIndex);
    return () => {
      current?.removeEventListener('transitionend', checkIndex);
    }
  }, [index]);

  useEffect(() => {
    const { current } = refCarousel;

    const eventMouseMove = (event: any) => {
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
  }, [startEv, refCarousel, initpositinX, finishPosition]);

  useEffect(() => {
    const getElement = refCarousel.current?.children[0];
    const lastChild = getElement?.lastChild?.cloneNode(true)!;
    const firstChild = getElement?.firstChild?.cloneNode(true)!;
    getElement?.appendChild(firstChild);
    getElement?.insertBefore(lastChild, getElement.firstChild);
    setPositionX(-getElement?.clientWidth!);
    setFinishPosition(-getElement?.clientWidth!);
  }, []);

  useEffect(() => {
    refCarousel.current?.classList.add(style.stopanimation);
    const getElementWidth = refCarousel.current?.children[0].children[index]!;
    if (getElementWidth === undefined) return;
    const calcnextIndex = -getElementWidth.clientWidth * index;
    setPositionX(calcnextIndex);
    setFinishPosition(calcnextIndex);
  }, [resizeWindow[0]]);

  return (
    <>
      <div
        ref={ refCarousel }
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
      <button onClick={ () => nextIndex(index - 1, true) }>Prev</button>
      <button onClick={ () => nextIndex(index + 1, true) }>Next</button>
      <button onClick={ () => nextIndex(2, true) }>Next index 2</button>
    </>
  )
}

export default Slide;
