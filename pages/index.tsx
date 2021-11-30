import type { NextPage } from 'next'
import Slide from '../components/Slide'
import SPanel from '../components/SPanel'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
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
    </div>
  )
}

export default Home
