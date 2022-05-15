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
      setInitialPosition(event.layerX);
      setEventStarted(true);
    }

    current?.addEventListener('touchstart', startEvent);
    current?.addEventListener('mousedown', startEvent);

    function finishEvent(event: any) {
      const cValue = current?.children[indexPanel].clientWidth!;
      const panelsIndex = current?.children.length!;

      if (event.layerX < initialPosition && indexPanel < panelsIndex - 1) {
        setIndexPanel((state) => state + 1);
        setFinishPosition((state) => state + cValue);
      } else if (event.layerX > initialPosition && finishPosition > 0) {
        setIndexPanel((state) => state - 1);
        setFinishPosition((state) => state - cValue);
      }
      setEventStarted(false);
    }

    current?.addEventListener('mouseup', finishEvent);
    // current?.addEventListener('mouseleave', finishEvent);

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
