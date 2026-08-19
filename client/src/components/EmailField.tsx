import { useEffect, useId, useRef, useState } from 'react';

const DEFAULT_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'me.com',
  'proton.me',
  'comcast.net',
];

type EmailFieldProps = {
  id: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function EmailField({
  id,
  name,
  required,
  autoComplete = 'email',
  placeholder = 'you@example.com',
  defaultValue,
}: EmailFieldProps) {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Array<{ label: string; value: string }>>([]);

  function getSuggestionData(value: string) {
    const trimmed = value.trim();
    const at = trimmed.indexOf('@');
    if (!trimmed || at === 0) return [];
    const local = at === -1 ? trimmed : trimmed.slice(0, at);
    const domainPart = at === -1 ? '' : trimmed.slice(at + 1).toLowerCase();
    if (!local) return [];
    if (at !== -1 && DEFAULT_DOMAINS.includes(domainPart)) return [];
    const matches = DEFAULT_DOMAINS.filter((domain) => !domainPart || domain.startsWith(domainPart));
    return matches.slice(0, 6).map((domain) => ({
      label: `@${domain}`,
      value: `${local}@${domain}`,
    }));
  }

  function renderFromValue(value: string) {
    const next = getSuggestionData(value);
    setSuggestions(next);
    setActiveIndex(-1);
    setOpen(next.length > 0);
  }

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="email-autocomplete" ref={wrapperRef}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="email"
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        onInput={(event) => renderFromValue((event.target as HTMLInputElement).value)}
        onFocus={(event) => renderFromValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (!open || !suggestions.length) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
          } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
          } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            if (inputRef.current) inputRef.current.value = suggestions[activeIndex].value;
            setOpen(false);
          } else if (event.key === 'Tab' && activeIndex >= 0) {
            if (inputRef.current) inputRef.current.value = suggestions[activeIndex].value;
            setOpen(false);
          } else if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      <div
        className="email-autocomplete__suggestions"
        id={listId}
        role="listbox"
        hidden={!open}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.value}
            type="button"
            className={
              index === activeIndex
                ? 'email-autocomplete__chip email-autocomplete__chip--active'
                : 'email-autocomplete__chip'
            }
            id={`${listId}-opt-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => {
              event.preventDefault();
              if (inputRef.current) inputRef.current.value = suggestion.value;
              setOpen(false);
            }}
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
