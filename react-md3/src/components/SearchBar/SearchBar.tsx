import { useState } from 'react'

import './SearchBar.css'

type SearchBarProps = {
  label?: string
  placeholder?: string
  defaultValue?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  label = 'Suche',
  placeholder = 'Suche starten',
  defaultValue = '',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextQuery = query.trim()
    if (!nextQuery) {
      setError('Bitte Suchbegriff eingeben.')
      return
    }

    setError(null)
    onSearch?.(nextQuery)
  }

  return (
    <form aria-label={label} className="m3-search-bar" onSubmit={submit} role="search">
      <label className="m3-search-bar__label" htmlFor="m3-search-bar-input">
        {label}
      </label>
      <div className="m3-search-bar__controls">
        <input
          id="m3-search-bar-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={query}
        />
        <button type="submit">Suchen</button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  )
}
