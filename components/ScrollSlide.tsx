import React, { useState, useEffect, useRef } from 'react';
import style from './sstyle.module.scss';

function ScrollSlid({ children }: any) {
  const [initialPosition, setInitialPosition] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);
  const [indexPanel, setIndexPanel] = useState(0);
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
      setInitialPosition(event.layerX - finishPosition);
      setEventStarted(true);
      setIndexPanel((state) => state + 1);
    }

    current?.addEventListener('touchstart', startEvent);
    current?.addEventListener('mousedown', startEvent);

    function finishEvent() {
      const cValue = current?.children[0].clientWidth!;
      setFinishPosition(cValue * indexPanel);
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
