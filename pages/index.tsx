import React from 'react';
import type { NextPage } from 'next';
import Slide from '../components/Slide';
import SPanel from '../components/SPanel';
import styles from '../styles/Home.module.css';
import ScrollSlide from '../components/ScrollSlide';

const Home: NextPage = function Home() {
  return (
    <div className={ styles.container }>
      <Slide>
        <SPanel>
          <div className={ styles.content }>
            Panel 1
          </div>
        </SPanel>
        <SPanel>
          <div className={ styles.content }>
            Panel 2
          </div>
        </SPanel>
        <SPanel>
          <div className={ styles.content }>
            Panel 3
          </div>
        </SPanel>
        <SPanel>
          <div className={ styles.content }>
            Panel 4
          </div>
        </SPanel>
        <SPanel>
          <div className={ styles.content }>
            Panel 5
          </div>
        </SPanel>
      </Slide>
      <ScrollSlide>
        <div className={ styles.content }>
          Panel 0
        </div>

        <div className={ styles.content }>
          Panel 1
        </div>

        <div className={ styles.content }>
          Panel 2
        </div>

        <div className={ styles.content }>
          Panel 3
        </div>

        <div className={ styles.content }>
          Panel 4
        </div>
      </ScrollSlide>

      {/* <button onClick={ refCarousel.current.prev }>Prev</button>
      <button onClick={ refCarousel.current.next }>Next</button>
      <button onClick={ () => refCarousel.current.nextIndex(2) }>Next index 2</button> */}
    </div>
  );
};

export default Home;
