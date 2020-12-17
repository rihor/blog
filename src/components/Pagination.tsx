import React, { useCallback } from 'react'
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
    padding: 5px 20px;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
  }

  button:disabled {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`

const Pagination: React.FC<Props> = ({
  setResult,
  page,
  nextPage,
  prevPage,
  totalPages
}) => {
  const handlePrevPage = useCallback(async () => {
    console.log(prevPage)

    if (!prevPage) return

    const response = await fetch(prevPage)
    const result = await response.json()
    setResult(result)
  }, [prevPage])

  const handleNextPage = useCallback(async () => {
    if (!nextPage) return
    const response = await fetch(nextPage)
    const result = await response.json()
    setResult(result)
  }, [nextPage])

  return (
    <Container>
      <button disabled={!prevPage} onClick={handlePrevPage}>
        &lsaquo;
      </button>
      <div>
        <span>
          {page} / {totalPages}
        </span>
      </div>
      <button disabled={!nextPage} onClick={handleNextPage}>
        &rsaquo;
      </button>
    </Container>
  )
}

export default Pagination
