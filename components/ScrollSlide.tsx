import React, { useState, useEffect, useRef } from 'react';
import style from './sstyle.module.scss';

function ScrollSlid({ children }: any) {
  const [initialPosition, setInitialPosition] = useState(0);
  const [finishPosition, setFinishPosition] = useState(0);
  const [indexPanel, setIndexPanel] = useState(0);
  const [enventStarted, setEventStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panelIndex = document.getElementById(`panel-${indexPanel}`)!;
    panelIndex.scrollIntoView({
      // behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [finishPosition]);

  useEffect(() => {
    const { current } = ref;
    function startEvent(event: any) {
      setInitialPosition(event.layerX);
      setEventStarted(true);
    }

    current?.addEventListener('mousedown', startEvent);

    function finishEvent(event: any) {
      const cValue = current?.children[indexPanel].clientWidth!;
      const panelsIndex = current?.children.length!;

      if (enventStarted && event.layerX < initialPosition && indexPanel < panelsIndex - 1) {
        setIndexPanel((state) => state + 1);
        setFinishPosition((state) => state + cValue);
      } else if (enventStarted && event.layerX > initialPosition && finishPosition > 0) {
        setIndexPanel((state) => state - 1);
        setFinishPosition((state) => state - cValue);
      }
      setEventStarted(false);
    }

    current?.addEventListener('mouseup', finishEvent);
    current?.addEventListener('mouseleave', finishEvent);

    function moveEvent(event: any) {
      if (enventStarted) {
        current?.scrollTo((initialPosition + finishPosition) - event.layerX, 0);
      }
    }

    current?.addEventListener('mousemove', moveEvent);
    return () => {
      current?.removeEventListener('mousedown', startEvent);
      current?.removeEventListener('mousemove', moveEvent);
      current?.removeEventListener('mouseup', finishEvent);
      current?.removeEventListener('mouseleave', finishEvent);
    };
  }, [enventStarted]);

  return (
    <div
      className={ style.mainpanel }
      ref={ ref }
      style={ enventStarted ? {
        scrollSnapType: 'none',
        scrollBehavior: 'auto',
      } : {} }
    >
      { children.map((child: any, index: number) => (
        <div className={ style.panel } key={ child.props.children } id={ `panel-${index}` }>
          { child }
        </div>
      )) }
    </div>
  );
}

export default ScrollSlid;
