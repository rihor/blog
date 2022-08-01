import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'

import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import SEO from '../components/SEO'
import { CustomResult, searchForTexts, getAllTexts } from '../lib/prismic'
import styles from '../styles/Texts.module.scss'

interface Props {
  initialResult: CustomResult
}

const TextsPage: NextPage<Props> = ({ initialResult }) => {
  const [result, setResult] = useState<CustomResult>(initialResult)

  const { page, prev_page, next_page, total_pages, results: texts } = result

  async function handleSearchText(text?: string) {
    const result = await searchForTexts(text)
    setResult(result)
  }

  return (
    <div>
      <main className={styles.main}>
        <SEO title="Todos os textos" description="Todos os meus textos" />
        <nav className={styles.nav}>
          <Link href="/">
            <a>LANDING PAGE</a>
          </Link>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </nav>
        <header className={styles.header}>
          <h1>Todos os textos</h1>
        </header>

        <SearchBar searchTextsWith={handleSearchText} />

        <Pagination
          page={page}
          totalPages={total_pages}
          prevPage={prev_page}
          nextPage={next_page}
          setResult={setResult}
        />
        <div className={styles.text}>
          {texts.map(text => (
            <Link key={text.id} href={`texts/${text.slugs[0]}`}>
              <article>
                <h1>{text.data.title[0].text}</h1>
                {Array.isArray(text.data.subtitle) && (
                  <h2>{text.data.subtitle[0].text}</h2>
                )}
                <p>{text.data.body[0].text}</p>
                <time>{dayjs(text.data.date).format('DD/MM/YYYY')}</time>
              </article>
            </Link>
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={total_pages}
          prevPage={prev_page}
          nextPage={next_page}
          setResult={setResult}
        />
      </main>
    </div>
  )
}

TextsPage.getInitialProps = async () => {
  const initialResult = await getAllTexts({})

  return { initialResult }
}

export default TextsPage
