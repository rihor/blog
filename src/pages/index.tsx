import { NextPage } from 'next'
import Link from 'next/link'
import React, { useCallback, useRef } from 'react'

import EerieScene from '../components/R3F/EerieScene'
import SEO from '../components/SEO'
import {
  RootContainer,
  ContentContainer,
  Header,
  Main,
  Nav
} from '../styles/home'

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
    <RootContainer>
      <SEO title="Abismo do Pedro" shouldExcludeTitleSuffix />
      <ContentContainer onMouseMove={onMouseMove}>
        <Main>
          <Nav>
            <a href="https://rihor-portfolio.now.sh/">PORTFOLIO</a>
          </Nav>

          <Header>
            <h1>Abismo</h1>

            <Link href="/texts">
              <button>
                <a>Meus textos</a>
              </button>
            </Link>
          </Header>
        </Main>
      </ContentContainer>
      <EerieScene isMobile={isMobile} mouse={mouse} />
    </RootContainer>
  )
}

Index.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

  const isMobile = /iPhone|iPad|iPod|Android|Mobile|Phone/i.test(userAgent)

  return { isMobile }
}

export default Index
