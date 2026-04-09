import { useState, useRef, useEffect } from 'react';
import { useAreaSearch } from '../hooks/useAreaSearch';
import type { AreaSuggestion } from '../types';

interface AreaAutocompleteProps {
  value: string;
  onSelect: (suggestion: AreaSuggestion) => void;
  error?: string;
}

export function AreaAutocomplete({ value, onSelect, error }: AreaAutocompleteProps) {
  const [input, setInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Once the user picks something we stop searching until they edit the field again
  const [isSelected, setIsSelected] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const { suggestions, isLoading, error: fetchError } = useAreaSearch(isSelected ? '' : input);

  useEffect(() => {
    setIsOpen(suggestions.length > 0);
    setActiveIndex(-1);
  }, [suggestions]);

  const handleSelect = (suggestion: AreaSuggestion) => {
    setInput(`${suggestion.mainText}, ${suggestion.secondaryText}`);
    setIsOpen(false);
    setIsSelected(true);
    onSelect(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={input}
        onChange={e => {
          setInput(e.target.value);
          setIsSelected(false);
          if (value) onSelect({ placeId: '', mainText: '', secondaryText: '' });
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type at least 3 characters"
        aria-label="Area"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="area-suggestions"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        className={`form-input ${error ? 'input-error' : ''}`}
      />

      {isLoading && <span className="autocomplete-loading">Searching...</span>}
      {fetchError && <span className="autocomplete-error">{fetchError}</span>}

      {isOpen && (
        <ul
          ref={listRef}
          id="area-suggestions"
          role="listbox"
          className="autocomplete-list"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.placeId}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`autocomplete-item ${index === activeIndex ? 'autocomplete-item--active' : ''}`}
              onMouseDown={() => handleSelect(suggestion)}
            >
              <span className="autocomplete-main">{suggestion.mainText}</span>
              <span className="autocomplete-secondary">{suggestion.secondaryText}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}