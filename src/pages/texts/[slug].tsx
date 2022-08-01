import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { useMemo } from 'react'

import SEO from '../../components/SEO'
import {
  CustomDocument,
  requestTextBySlug,
  retrieveAllSlugs
} from '../../lib/prismic'
import styles from '../../styles/Slug.module.scss'

interface Props {
  text: CustomDocument
}

const TextPage: NextPage<Props> = ({ text }) => {
  const collab = text?.data?.collab.slug

  const bodyInnerHTML = useMemo(
    () => ({
      __html: RichText.asHtml(text.data.body)
    }),
    []
  )

  return (
    <div>
      <main className={styles.main}>
        <SEO
          title={text.data?.title ? RichText.asText(text.data.title) : 'Texto'}
          description={text.data?.body ? text.data.body[0].text : 'Texto'}
        />
        <nav className={styles.nav}>
          <Link href="/texts">
            <a>TEXTOS</a>
          </Link>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </nav>
        {text.data && (
          <article className={styles.text}>
            <header className={styles.header}>
              <h1>{RichText.asText(text.data.title)}</h1>
              <h2>{RichText.asText(text.data.subtitle)}</h2>
              {collab && (
                <h3>
                  Escrito em colaboração com <span>{collab}</span>
                </h3>
              )}
            </header>
            <div dangerouslySetInnerHTML={bodyInnerHTML} />
          </article>
        )}
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = await retrieveAllSlugs()

  const paths = allSlugs.map(slug => {
    return {
      params: { slug: slug.uid }
    }
  })

  console.log(paths)

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug)

  const textResult = await requestTextBySlug(slug)

  return {
    props: {
      text: textResult
    },
    revalidate: 1
  }
}

export default TextPage
