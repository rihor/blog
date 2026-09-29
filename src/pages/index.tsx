import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import SEO from '../components/SEO'
import styles from '../styles/Home.module.scss'

// WebGL only exists in the browser: keep three.js out of the server render
const OceanStage = dynamic(() => import('../components/Ocean/OceanStage'), {
  ssr: false
})
// Tuning panel, only downloaded when the URL has ?controles
const OceanControls = dynamic(() => import('../components/Ocean/Controls'), {
  ssr: false
})

const Index: NextPage = () => {
  const [ready, setReady] = useState(false)
  const [tuning, setTuning] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the query string only exists after hydration
    setTuning(new URLSearchParams(window.location.search).has('controles'))
  }, [])

  return (
    <div className={styles.root}>
      <SEO
        title="Abismo do Pedro"
        description="Onde eu jogo meus textos."
        shouldExcludeTitleSuffix
      />

      <div className={styles.stage} data-ready={ready} aria-hidden="true">
        <OceanStage onReady={handleReady} />
      </div>

      <div className={styles.overlay}>
        <nav className={styles.nav} aria-label="Principal">
          <a href="https://rihor-portfolio.now.sh/">Portfolio</a>
        </nav>

        <header className={styles.header}>
          <h1>Abismo</h1>
          <Link className={styles.cta} href="/texts">
            Meus textos
          </Link>
        </header>

        <footer className={styles.footer}>
          <p className={styles.hint}>
            <span className={styles.hintPointer}>
              Mova para olhar em volta.
            </span>
            <span className={styles.hintTouch}>
              Arraste para olhar em volta.
            </span>
          </p>
        </footer>
      </div>

      {tuning && <OceanControls />}
    </div>
  )
}

export default Index
