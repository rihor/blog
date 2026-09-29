import { useCallback } from 'react'

import styles from './Pagination.module.scss'
import type { CustomResult } from '../../lib/prismic'

interface Props {
  setResult: (result: CustomResult) => void
  page: number
  nextPage: null | string
  prevPage: null | string
  totalPages: number
}

// example of regex find: "page=2"
function changePageOnUrl(url: string, pageDesired: number) {
  return url.replace(/page=\d*/, `page=${pageDesired}`)
}

async function fetchTexts(url: string): Promise<CustomResult> {
  const response = await fetch(url)
  return (await response.json()) as CustomResult
}

const Pagination: React.FC<Props> = ({
  setResult,
  page,
  nextPage,
  prevPage,
  totalPages
}) => {
  const goTo = useCallback(
    (url: string | null) => {
      if (!url) return
      fetchTexts(url).then(setResult).catch(console.error)
    },
    [setResult]
  )

  const handleFirstPage = useCallback(
    () => goTo(prevPage && changePageOnUrl(prevPage, 1)),
    [goTo, prevPage]
  )
  const handlePrevPage = useCallback(() => goTo(prevPage), [goTo, prevPage])
  const handleNextPage = useCallback(() => goTo(nextPage), [goTo, nextPage])
  const handleLastPage = useCallback(
    () => goTo(nextPage && changePageOnUrl(nextPage, totalPages)),
    [goTo, nextPage, totalPages]
  )

  return (
    <div className={styles.pagination}>
      <div className={styles.button_group}>
        <button disabled={page <= 1} onClick={handleFirstPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
        <button disabled={!prevPage} onClick={handlePrevPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <div>
        <span>
          {page} / {totalPages}
        </span>
      </div>
      <div className={styles.button_group}>
        <button disabled={!nextPage} onClick={handleNextPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button disabled={!nextPage} onClick={handleLastPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination
