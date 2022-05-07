import React, { ReactNode } from 'react';
import style from './style.module.css';

type Props = {
  children: ReactNode
}

function SPanel({ children }: Props) {
  return (
    <div className={ style.panel }>
      { children }
    </div>
  );
}

export default SPanel;
