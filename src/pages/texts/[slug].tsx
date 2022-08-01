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
import { Background, Main, Header, Nav, Text } from '../../styles/slug'

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
    <Background>
      <Main>
        <SEO
          title={text.data?.title ? RichText.asText(text.data.title) : 'Texto'}
          description={text.data?.body ? text.data.body[0].text : 'Texto'}
        />
        <Nav>
          <Link href="/texts">
            <a>TEXTOS</a>
          </Link>
          <a href="https://rihor-portfolio.now.sh">PORTFOLIO</a>
        </Nav>
        {text.data && (
          <Text>
            <Header>
              <h1>{RichText.asText(text.data.title)}</h1>
              <h2>{RichText.asText(text.data.subtitle)}</h2>
              {collab && (
                <h3>
                  Escrito em colaboração com <span>{collab}</span>
                </h3>
              )}
            </Header>
            <div dangerouslySetInnerHTML={bodyInnerHTML} />
          </Text>
        )}
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
