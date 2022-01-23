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
  const [startEv, setStartEv] = useState(false);
  const [positonX, setPositionX] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);
  const [initpositinX, setInitpositinX] = useState(0);
  const [index, setIndex] = useState(1);
  const [panels, setPanels] = useState<ReactNode>();

  function prev() {
    setIndex(index - 1);
    const previndex = slideRef.current?.children[0].children[index - 1].clientWidth!;
    const calcLeft = previndex + finishPosition;
    setPositionX(calcLeft);
    setFinishPosition(calcLeft);
  }

  function next() {
    setIndex(index + 1);
    const nextindex = slideRef.current?.children[0].children[index].clientWidth!;
    const calcRight = -nextindex + positonX;
    setPositionX(calcRight);
    setFinishPosition(calcRight);
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
    setPanels([children[children.length - 1], ...children, children[0]]);
  }, [children]);

  useEffect(() => {
    const initIndex = -slideRef.current?.children[0].children[index]?.clientWidth!;
    setPositionX(initIndex);
  }, [panels])

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
          { panels }
        </div>
      </div>
      <button onClick={ prev }>Prev</button>
      <button onClick={ next }>Next</button>
    </>
  )
}

export default Slide
