import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'

import SEO from '../components/SEO'
import { CustomResult, requestAllTexts } from '../lib/prismic'

interface Props {
  result: CustomResult
}

dayjs.locale('pt-br')

const TextsPage: NextPage<Props> = ({ result }) => {
  const texts = result.results

  return (
    <main>
      <SEO title="Textos" />
      <nav>
        <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
      </nav>
      <header>
        <h1>Todos os textos</h1>
      </header>

      <ul>
        {texts.map(text => (
          <li
            key={text.id}
            style={{ background: '#fefefe', borderRadius: 4, marginBottom: 10 }}
          >
            <Link href={`texts/${text.slugs[0]}`}>
              <div>
                <h1>{text.data.title[0].text}</h1>
                <h2>{text.data.subtitle[0].text}</h2>
                <p>{text.data.body[0].text}</p>
                <p>{dayjs(text.data.date).format('DD/MM/YYYY')}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

TextsPage.getInitialProps = async () => {
  const result = await requestAllTexts()

  return { result }
}

export default TextsPage
