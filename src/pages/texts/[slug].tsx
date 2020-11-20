import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import React from 'react'

import SEO from '../../components/SEO'
import {
  CustomDocument,
  requestTextBySlug,
  retrieveAllSlugs
} from '../../lib/prismic'
import { Background, Main, Nav, Text } from '../../styles/slug'

interface Props {
  text: CustomDocument
}

const TextPage: NextPage<Props> = ({ text }) => {
  const collab = text.data.collab.slug

  return (
    <Background>
      <Main>
        <SEO title="Todos os textos" />
        <Nav>
          <Link href="/texts">
            <a>TEXTOS</a>
          </Link>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </Nav>
        <Text>
          <header style={{ marginBottom: 40 }}>
            <h1>{RichText.asText(text.data.title)}</h1>
            <h2>{RichText.asText(text.data.subtitle)}</h2>
            {collab && (
              <h3>
                Escrito em colaboração com <span>{collab}</span>
              </h3>
            )}
          </header>
          <div
            dangerouslySetInnerHTML={{
              __html: RichText.asHtml(text.data.body)
            }}
          />
        </Text>
      </Main>
    </Background>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = await retrieveAllSlugs()

  const paths = allSlugs.map(slug => {
    return {
      params: { slug: slug.uid }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { slug } = params

  const textResult = await requestTextBySlug(String(slug))

  return {
    props: {
      text: textResult
    },
    revalidate: 60
  }
}

export default TextPage
