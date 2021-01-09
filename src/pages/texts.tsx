import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from 'next/link'
import Prismic from 'prismic-javascript'
import React, { useState } from 'react'

import Pagination from '../components/Pagination'
import SEO from '../components/SEO'
import { CustomResult, request } from '../lib/prismic'
import { Background, Main, Header, Nav, TextsContainer } from '../styles/texts'

interface Props {
  initialResult: CustomResult
}

const TextsPage: NextPage<Props> = ({ initialResult }) => {
  const [result, setResult] = useState<CustomResult>(initialResult)

  const { page, prev_page, next_page, total_pages, results: texts } = result

  return (
    <Background>
      <Main>
        <SEO title="Todos os textos" />
        <Nav>
          <Link href="/">
            <a>LANDING PAGE</a>
          </Link>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </Nav>
        <Header>
          <h1>Todos os textos</h1>
        </Header>

        <Pagination
          page={page}
          totalPages={total_pages}
          prevPage={prev_page}
          nextPage={next_page}
          setResult={setResult}
        />
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
        <Pagination
          page={page}
          totalPages={total_pages}
          prevPage={prev_page}
          nextPage={next_page}
          setResult={setResult}
        />
      </Main>
    </Background>
  )
}

TextsPage.getInitialProps = async () => {
  const initialResult = await request(
    [Prismic.Predicates.at('document.type', 'text')],
    { pageSize: 10, page: 1, orderings: '[my.text.date desc]' }
  )

  return { initialResult }
}

export default TextsPage
