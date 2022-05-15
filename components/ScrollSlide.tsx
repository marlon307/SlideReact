import React, { useState, useEffect, useRef } from 'react';
import style from './sstyle.module.scss';

function ScrollSlid({ children }: any) {
  const [initialPosition, setInitialPosition] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);
  const [indexPanel, setIndexPanel] = useState(1);
  const [enventStarted, setEventStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    current?.scrollTo({
      left: finishPosition,
      behavior: 'smooth',
    });
  }, [finishPosition]);

  useEffect(() => {
    const { current } = ref;
    function startEvent(event: any) {
      setInitialPosition(event.layerX);

      setEventStarted(true);
    }

    current?.addEventListener('touchstart', startEvent);
    current?.addEventListener('mousedown', startEvent);

    function finishEvent(event: any) {
      const cValue = current?.children[indexPanel - 1].clientWidth!;

      if (event.layerX < initialPosition) {
        setIndexPanel(indexPanel + 1);
        setFinishPosition(cValue * indexPanel);
      } else {
        setIndexPanel(indexPanel - 1);
        setFinishPosition(finishPosition - cValue);
      }

      setEventStarted(false);
    }

    current?.addEventListener('mouseup', finishEvent);

    function moveEvent(event: any) {
      if (enventStarted) {
        current?.scrollTo((initialPosition + finishPosition) - event.layerX, 0);
      }
    }

    current?.addEventListener('mousemove', moveEvent);
    return () => {
      current?.removeEventListener('touchstart', startEvent);
      current?.removeEventListener('mousedown', startEvent);
      current?.removeEventListener('mousemove', moveEvent);
      current?.removeEventListener('mouseup', finishEvent);
    };
  }, [enventStarted]);

  return (
    <div
      className={ style.mainpanel }
      ref={ ref }
    >
      { children }
    </div>
  );
}

export default ScrollSlid;
