import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import {
  CustomDocument,
  requestTextBySlug,
  retrieveAllSlugs
} from '../../lib/prismic'

interface Props {
  text: CustomDocument
}

const TextPage: NextPage<Props> = ({ text }) => {
  return <main>{JSON.stringify(text)}</main>
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
