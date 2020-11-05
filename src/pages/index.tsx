import { GetServerSideProps } from 'next'
import React, { useState, useEffect } from 'react'

import EerieScene from '../components/R3F/Scenes/Eerie'
import { Main } from '../styles/home'

const Index: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  return (
    <Main>
      <EerieScene isMobile={isMobile} />
      <a href="https://rihor-portfolio.now.sh/">Portfolio</a>
      <header>
        <h1>Abismo do Pedro</h1>
      </header>
    </Main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  }
}

export default Index
