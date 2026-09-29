import * as prismic from '@prismicio/client'

interface TextData {
  body: Array<{ spans: Array<string>; text: string; type: string }>
  collab: {
    link_type: string
    id?: string
    slug?: string
    uid?: string
    type?: string
  }
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

export interface CustomDocument extends prismic.PrismicDocument {
  data: TextData
}

export type CustomResult = prismic.Query<CustomDocument>

interface GetAllTextsInterface {
  pageSize?: number
  page?: number
}

const apiEndpoint = 'https://rihor-blog.cdn.prismic.io/api/v2'

const cmsClient = (): prismic.Client<CustomDocument> =>
  prismic.createClient<CustomDocument>(apiEndpoint)

export const request = async (
  filters: string | string[],
  params?: Partial<prismic.BuildQueryURLArgs>
): Promise<CustomResult> => {
  const response = await cmsClient().get({
    ...params,
    filters: Array.isArray(filters) ? filters : [filters]
  })

  return response
}

export const retrieveAllSlugs = async (): Promise<CustomDocument[]> => {
  const slugsResult = await request(
    [prismic.filter.at('document.type', 'text')],
    { fetch: 'text.title' }
  )

  return slugsResult.results
}

export const requestTextBySlug = async (
  slug: string
): Promise<CustomDocument> => {
  const textResult = await cmsClient().getByUID('text', slug)

  return textResult
}

export const getAllTexts = async ({
  pageSize = 10,
  page = 1
}: GetAllTextsInterface): Promise<CustomResult> => {
  const result = await request([prismic.filter.at('document.type', 'text')], {
    pageSize,
    page,
    orderings: [{ field: 'my.text.date', direction: 'desc' }]
  })

  return result
}

export const searchForTexts = async (
  textToSearch?: string
): Promise<CustomResult> => {
  let result: CustomResult

  if (!textToSearch) {
    result = await getAllTexts({})
  } else {
    result = await request([
      prismic.filter.at('document.type', 'text'),
      prismic.filter.fulltext('document', textToSearch)
    ])
  }

  return result
}
