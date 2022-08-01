import { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useRef } from 'react'

import EerieScene from '../components/R3F/EerieScene'
import SEO from '../components/SEO'
import styles from '../styles/Home.module.scss'

interface MouseMoveArgs {
  clientX: number
  clientY: number
}

interface Props {
  isMobile: boolean
}

const Index: NextPage<Props> = ({ isMobile }) => {
  const mouse = useRef([0, 0])

  const onMouseMove = useCallback(({ clientX, clientY }: MouseMoveArgs) => {
    mouse.current = [
      clientX - window.innerWidth / 2,
      clientY - window.innerHeight / 2
    ]
  }, [])

  return (
    <div className={styles.root}>
      <SEO
        title="Abismo do Pedro"
        description="Onde eu jogo meus textos."
        shouldExcludeTitleSuffix
      />
      <section className={styles.content} onMouseMove={onMouseMove}>
        <main className={styles.main}>
          <nav className={styles.nav}>
            <a href="https://rihor-portfolio.now.sh/">PORTFOLIO</a>
          </nav>

          <header className={styles.header}>
            <h1>Abismo</h1>

            <button>
              <Link href="/texts">
                <a>Meus textos</a>
              </Link>
            </button>
          </header>
        </main>
      </section>
      <EerieScene isMobile={isMobile} mouse={mouse} />
    </div>
  )
}

Index.getInitialProps = async ({ req }) => {
  const userAgent = (
    req ? req.headers['user-agent'] : navigator.userAgent
  ) as string

  const isMobile = /iPhone|iPad|iPod|Android|Mobile|Phone/i.test(userAgent)

  return { isMobile }
}

export default Index
