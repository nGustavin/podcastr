import { format, parseISO } from 'date-fns';
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticProps } from 'next';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

interface Episode{
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string
}

interface HomeProps{
  latestEpisodes: Episode[];
  allEpisodes: Episode[]
}

export default function Home({allEpisodes, latestEpisodes}: HomeProps) {

  const { play } = useContext(PlayerContext)

    

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Image
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => {play(episode)}}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcaster</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>   
            <tbody>
              {allEpisodes.map(episode => {
                return(
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      /> 
                      </td>
                      <td>
                        <Link  href={`/episodes/${episode.id}`}>
                          <a>{episode.title}</a>
                        </Link>
                      </td>
                      <td>{episode.members}</td>
                      <td style={{ width: 100 }}>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td>
                        <button type="button">
                          <img src="/play-green.svg" alt="Tocar episodio"/>
                        </button>
                      </td>
                      
                    
                  </tr>
                )
              })}
            </tbody>       
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes',{
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      url: episode.file.url,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })
  
  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return { 
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}





//                    SSR
// Vai atualizar toda vez que alguem acessar a Home

// export async function getServerSideProps(){
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return { 
//     props: {
//       episodes: data,
//     }
//   }
// }


//                  SPA
// useEffect(() => {
//   fetch('http://localhost:3333/episodes')
//     .then(response => response.json())
//     .then(data => console.log(data))
// }, [])


//                  SSG
// Vai fazer uma chamada na API apenas quantas vezes for passado no revalidade,
// nesse exemplo vai carregar tres vezes no dia e todas as pessoas vao acessar
// um html estatico dessa pagina, deixando o app muito mais performatico por evitar
// fazer uma quantidade imensa de requests pro servidor, nao importa quantas pessoas
// acessem, ela vai ver um html pronto com dados estaticos e tres vezes ao dia os dados
// serao alterados
// export async function getStaticProps(){
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return { 
//     props: {
//       episodes: data,
//     },

//     revalidate: 60 * 60 * 8,
//   }
// }

