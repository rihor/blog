import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React, { useState, useEffect, useCallback, useRef } from 'react'

import EerieScene from '../components/R3F/EerieScene'
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

const Index: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  const mouse = useRef([0, 0])

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const onMouseMove = useCallback(({ clientX, clientY }: MouseMoveArgs) => {
    mouse.current = [
      clientX - window.innerWidth / 2,
      clientY - window.innerHeight / 2
    ]
  }, [])

  return (
    <RootContainer>
      <ContentContainer onMouseMove={onMouseMove}>
        <Main>
          <Nav>
            <a href="https://rihor-portfolio.now.sh/">PORTFOLIO</a>
          </Nav>

          <Header>
            <h1>{String(isMobile)}</h1>

            <button>
              <Link href="/texts">
                <a>Meus textos</a>
              </Link>
            </button>
          </Header>
        </Main>
      </ContentContainer>
      <EerieScene isMobile={isMobile} mouse={mouse} />
    </RootContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  }
}

export default Index
