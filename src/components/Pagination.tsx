import { useCallback } from 'react'
import styled from 'styled-components'

import { CustomResult } from '../lib/prismic'

interface Props {
  setResult(texts: React.SetStateAction<CustomResult>): void
  page: number
  nextPage: null | string
  prevPage: null | string
  totalPages: number
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 22px 0;
  color: #fff;

  span {
    font-family: 'Work Sans', Arial, Helvetica, sans-serif;
    font-size: 18px;
  }

  button {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      flex: none;
      width: 20px;
      height: 20px;
      color: #fefefe;
    }
  }

  button:disabled {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;

    svg {
      opacity: 0.3;
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    margin: 0 4px;
  }
`

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
    <Container>
      <ButtonGroup>
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
      </ButtonGroup>
      <div>
        <span>
          {page} / {totalPages}
        </span>
      </div>
      <ButtonGroup>
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
      </ButtonGroup>
    </Container>
  )
}

export default Pagination
