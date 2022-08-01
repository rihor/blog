import { useCallback } from 'react'

import { CustomResult } from '../../lib/prismic'
import styles from './Pagination.module.scss'

interface Props {
  setResult(texts: React.SetStateAction<CustomResult>): void
  page: number
  nextPage: null | string
  prevPage: null | string
  totalPages: number
}

const Pagination: React.FC<Props> = ({
  setResult,
  page,
  nextPage,
  prevPage,
  totalPages
}) => {
  function changePageOnUrl(url: string, pageDesired: number) {
    // example of regex find: "page=2"
    return url.replace(/page=\d*/, `page=${pageDesired}`)
  }

  async function handleFetchTexts(url: string) {
    const response = await fetch(url)
    const result = await response.json()
    setResult(result)
  }

  const handlePrevPage = useCallback(async () => {
    if (!prevPage) return
    await handleFetchTexts(prevPage)
  }, [prevPage])

  const handleNextPage = useCallback(async () => {
    if (!nextPage) return
    await handleFetchTexts(nextPage)
  }, [nextPage])

  const handleLastPage = useCallback(async () => {
    if (!nextPage) return
    const pageToSearch = changePageOnUrl(nextPage, totalPages)
    await handleFetchTexts(pageToSearch)
  }, [nextPage])

  const handleFirstPage = useCallback(async () => {
    if (!prevPage) return
    const pageToSearch = changePageOnUrl(prevPage, 1)
    await handleFetchTexts(pageToSearch)
  }, [prevPage])

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
