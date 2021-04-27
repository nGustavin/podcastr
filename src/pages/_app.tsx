import { Header } from '../components/Header'
import { Player } from '../components/Player'
import styles from '../styles/app.module.scss'
import '../styles/global.scss'
import {PlayerContext} from '../contexts/PlayerContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [isPlaying, setIsPlaying] = useState(false)
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        play, 
        tooglePlay, 
        setPlayingState
      }}>
        
      <div className={styles.appWrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
