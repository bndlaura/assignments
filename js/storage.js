const HISTORY_KEY = 'search_history';
const FAVORITES_KEY = 'favorites';

export function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

export function saveSearch(term) {
  let history = getSearchHistory();
  history = [term, ...history.filter(t => t !== term)].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function toggleFavorite(code) {
  let favs = getFavorites();
  favs = favs.includes(code)
    ? favs.filter(c => c !== code)
    : [...favs, code];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function clearHistory() {
  localStorage.removeItem('search_history');
}

