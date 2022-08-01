import { FC, useRef } from 'react'

import styles from './SearchBar.module.scss'

interface Props {
  searchTextsWith(text?: string): Promise<void>
}

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Pesquisar palavra em textos"
        ref={inputRef}
      />
      <div className={styles.group_buttons}>
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
      </div>
    </form>
  )
}

export default SearchBar
