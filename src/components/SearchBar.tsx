import { FC, useRef } from 'react'
import styled from 'styled-components'

interface Props {
  searchTextsWith(text?: string): Promise<void>
}

const Form = styled.form`
  margin: 0 4px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    & {
      flex-direction: column;
    }
  }

  input {
    flex: auto;
    color: #fefefe;
    font-size: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid transparent;
    border-radius: 4px;
    transition: 0.2s;
  }

  input:focus {
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  input::placeholder {
    color: #fefefe;
    opacity: 0.4;
  }
`

const GroupButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-left: 6px;

  button {
    margin-left: 4px;
    padding: 0 8px;
    height: 100%;
    border-radius: 4px;
  }

  button:nth-child(1) {
    background: transparent;
    font-size: 14px;
    color: #fefefe;
    opacity: 0.8;
    flex: none;
    transition: 0.2s;
  }

  button:nth-child(1):hover {
    background: rgba(255, 255, 255, 0.1);
  }

  button:nth-child(1):active {
    background: rgba(255, 255, 255, 0.2);
  }

  button:nth-child(2) {
    background: #5c5fff;
    color: #fefefe;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;

    svg {
      flex: none;
      height: 20px;
      width: 20px;
    }
  }

  button:nth-child(2):hover {
    background: #5659ee;
  }

  button:nth-child(2):active {
    background: #4b4ece;
  }

  @media screen and (max-width: 600px) {
    & {
      margin-left: 0px;
      margin-top: 6px;
      height: 46px;
      justify-content: space-between;
    }
  }
`

const SearchBar: FC<Props> = ({ searchTextsWith }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('handleSubmit')

    if (inputRef.current) {
      searchTextsWith(inputRef.current.value)
    }
  }

  function cancelSearch() {
    console.log('cancelSearch')
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    searchTextsWith(undefined)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Pesquisar palavra em textos"
        ref={inputRef}
      />
      <GroupButtons>
        <button onClick={cancelSearch} type="button">
          Limpar busca
        </button>
        <button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </GroupButtons>
    </Form>
  )
}

export default SearchBar
