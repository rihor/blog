import Prismic from 'prismic-javascript'
import ApiSearchResponse from 'prismic-javascript/types/ApiSearchResponse'
import { DefaultClient } from 'prismic-javascript/types/client'
import { Document } from 'prismic-javascript/types/documents'
import { RequestCallback } from 'prismic-javascript/types/request'
import { QueryOptions } from 'prismic-javascript/types/ResolvedApi'

interface TextData {
  body: Array<{ spans: Array<string>; text: string; type: string }>
  collab: { link_type: string }
  title: Array<{ text: string; type: string }>
  subtitle?: Array<{ text: string; type: string }>
  type: {
    id: string
    slug: string
  }
  thumbnail: {
    url: string
    alt: string
    copyright: string
    dimensions: { width: number; height: number }
  }
  date: string
}

export interface CustomDocument extends Document {
  data: TextData
}

export interface CustomResult extends ApiSearchResponse {
  results: CustomDocument[]
}

const apiEndpoint = 'https://rihor-blog.cdn.prismic.io/api/v2'

const cmsClient = (req = null): DefaultClient => {
  const options = req ? { req } : null

  return Prismic.client(apiEndpoint, options)
}

const request = async (
  query: string | string[],
  optionsOrCallback?: QueryOptions | RequestCallback<ApiSearchResponse>
): Promise<ApiSearchResponse> => {
  const response = await cmsClient().query(query, optionsOrCallback)

  return response
}

export const requestAllTexts = async (page = 1): Promise<CustomResult> => {
  const result = await request(
    [Prismic.Predicates.at('document.type', 'text')],
    { pageSize: 30, page, orderings: '[my.text.date desc]' }
  )

  return result
}

export const retrieveAllSlugs = async (): Promise<Document[]> => {
  const slugsResult = await request(
    [Prismic.Predicates.at('document.type', 'text')],
    { fetch: 'text.title' }
  )

  return slugsResult.results
}

export const requestTextBySlug = async (
  slug: string
): Promise<CustomDocument> => {
  const textResult = await cmsClient().getByUID('text', slug, {})

  return textResult
}
