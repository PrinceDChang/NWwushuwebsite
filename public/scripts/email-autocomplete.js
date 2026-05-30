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

export function initEmailAutocomplete(input, { domains = DEFAULT_DOMAINS, maxSuggestions = 6 } = {}) {
  if (!input || input.dataset.emailAutocompleteInit) return;

  input.dataset.emailAutocompleteInit = 'true';

  const wrapper = document.createElement('div');
  wrapper.className = 'email-autocomplete';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const listId = input.id ? `${input.id}-suggestions` : `email-suggestions-${Date.now()}`;
  const suggestionsEl = document.createElement('div');
  suggestionsEl.className = 'email-autocomplete__suggestions';
  suggestionsEl.id = listId;
  suggestionsEl.setAttribute('role', 'listbox');
  suggestionsEl.hidden = true;
  wrapper.appendChild(suggestionsEl);

  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', listId);
  input.setAttribute('aria-expanded', 'false');

  let activeIndex = -1;
  let suggestions = [];

  function getSuggestionData() {
    const value = input.value.trim();
    const at = value.indexOf('@');

    if (!value || at === 0) return [];

    const local = at === -1 ? value : value.slice(0, at);
    const domainPart = at === -1 ? '' : value.slice(at + 1).toLowerCase();

    if (!local) return [];

    if (at !== -1 && domains.includes(domainPart)) return [];

    const matches = domains.filter((domain) => !domainPart || domain.startsWith(domainPart));
    return matches.slice(0, maxSuggestions).map((domain) => ({
      local,
      domain,
      label: `@${domain}`,
      value: `${local}@${domain}`,
    }));
  }

  function setActive(index) {
    const options = suggestionsEl.querySelectorAll('.email-autocomplete__chip');
    options.forEach((option, i) => {
      option.classList.toggle('email-autocomplete__chip--active', i === index);
      option.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    activeIndex = index;
    if (index >= 0 && options[index]) {
      input.setAttribute('aria-activedescendant', options[index].id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function hide() {
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
    suggestions = [];
    activeIndex = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function select(value) {
    input.value = value;
    hide();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }

  function render() {
    suggestions = getSuggestionData();
    suggestionsEl.innerHTML = '';
    activeIndex = -1;

    if (!suggestions.length) {
      hide();
      return;
    }

    suggestions.forEach((suggestion, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'email-autocomplete__chip';
      chip.id = `${listId}-opt-${index}`;
      chip.setAttribute('role', 'option');
      chip.setAttribute('aria-selected', 'false');
      chip.textContent = suggestion.label;

      chip.addEventListener('mousedown', (event) => {
        event.preventDefault();
        select(suggestion.value);
      });

      suggestionsEl.appendChild(chip);
    });

    suggestionsEl.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (!wrapper.contains(document.activeElement)) hide();
    }, 0);
  });

  input.addEventListener('keydown', (event) => {
    if (suggestionsEl.hidden || !suggestions.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      setActive(activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive(activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1);
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      select(suggestions[activeIndex].value);
      return;
    }

    if (event.key === 'Tab' && activeIndex >= 0) {
      select(suggestions[activeIndex].value);
      return;
    }

    if (event.key === 'Escape') {
      hide();
    }
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) hide();
  });
}
