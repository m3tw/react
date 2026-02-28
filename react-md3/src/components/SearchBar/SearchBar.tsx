import { useState } from 'react'
import { IconButton } from "../IconButton";

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
      <div className="m3-search-bar__container">
        <div className="m3-search-bar__leading-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          aria-label={label}
          className="m3-search-bar__input"
          id="m3-search-bar-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={query}
        />
        <div className="m3-search-bar__trailing-actions">
          <IconButton
            ariaLabel="Suchen"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
            type="submit"
          />
        </div>
      </div>
      {error ? <p className="m3-search-bar__error" role="alert">{error}</p> : null}
    </form>
  )
}
