import React, { useState, useEffect, useRef } from 'react';
import style from './sstyle.module.scss';
// https://jsfiddle.net/pjqxrgwu/
// https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
function ScrollSlid({ children }: any) {
  const [initialPosition, setInitialPosition] = useState(0);
  const [indexPanel, setIndexPanel] = useState(0);
  const [enventStarted, setEventStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = ref.current!.querySelectorAll('*');

    const observer = new IntersectionObserver(([entries]) => {
      if (entries.isIntersecting) {
        setIndexPanel(Number(entries.target.id.replace('panel-', '')));
      }

      entries.target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }, { threshold: 1 });

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const { current } = ref;
    function startEvent(event: any) {
      current?.classList.add(style.stop_animation);
      setInitialPosition(event.layerX);
      setEventStarted(true);
    }

    current?.addEventListener('mousedown', startEvent);

    function finishEvent() {
      current?.classList.remove(style.stop_animation);
      setEventStarted(false);
    }

    current?.addEventListener('mouseup', finishEvent);
    current?.addEventListener('mouseleave', finishEvent);

    function moveEvent(event: any) {
      if (enventStarted) {
        const cValue = current?.children[indexPanel].clientWidth!;
        current?.scrollTo((initialPosition + (indexPanel * cValue)) - event.layerX, 0);
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
      ref={ ref }
      className={ style.mainpanel }
    >
      { children.map((child: any, index: number) => (
        <div
          className={ style.content }
          key={ child.props.children }
          id={ `panel-${index}` }
        >
          { child }
        </div>
      )) }
    </div>
  );
}

export default ScrollSlid;
