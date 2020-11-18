import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'

import SEO from '../components/SEO'
import { CustomResult, requestAllTexts } from '../lib/prismic'
import { Background, Main, Nav, TextsContainer } from '../styles/texts'

interface Props {
  result: CustomResult
}

dayjs.locale('pt-br')

const TextsPage: NextPage<Props> = ({ result }) => {
  const texts = result.results

  return (
    <Background>
      <Main>
        <SEO title="Todos os textos" />
        <Nav>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </Nav>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ color: 'white' }}>Todos os textos</h1>
        </header>

        <TextsContainer>
          {texts.map(text => (
            <Link key={text.id} href={`texts/${text.slugs[0]}`}>
              <article>
                <h1>{text.data.title[0].text}</h1>
                <h2>{text.data.subtitle[0].text}</h2>
                <p>{text.data.body[0].text}</p>
                <time>{dayjs(text.data.date).format('DD/MM/YYYY')}</time>
              </article>
            </Link>
          ))}
        </TextsContainer>
      </Main>
    </Background>
  )
}

TextsPage.getInitialProps = async () => {
  const result = await requestAllTexts()

  return { result }
}

export default TextsPage
