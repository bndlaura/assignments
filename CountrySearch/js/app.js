import { fetchAllCountries } from './api.js';
import { renderCountries, renderHistory } from './ui.js';
import { saveSearch, getSearchHistory, clearHistory } from './storage.js';

const input = document.getElementById('search-input');
const form = document.getElementById('search-form');
const results = document.getElementById('results');
const historyContainer = document.getElementById('search-history');
const clearBtn = document.getElementById('clear-history');
const statusMsg = document.getElementById('status-msg');

let allCountries = [];

async function init() {
  allCountries = await fetchAllCountries();
  statusMsg.textContent = '';
  renderHistory(getSearchHistory(), historyContainer, search);
}

function search(term) {
  const clean = term.trim();
  statusMsg.textContent = '';
  results.innerHTML = '';

  if (!clean) {
    statusMsg.textContent = 'Please enter a country name.';
    return;
  }

  const filtered = allCountries.filter(c =>
    c.name.common.toLowerCase().includes(clean.toLowerCase())
  );

  if (!filtered.length) {
    statusMsg.textContent = `No country found for "${clean}".`;
    return;
  }
  saveSearch(clean);

  renderCountries(filtered, results);
  renderHistory(getSearchHistory(), historyContainer, search);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  search(input.value.trim());
});

clearBtn.addEventListener('click', () => {
  clearHistory();
  renderHistory(getSearchHistory(), historyContainer, search);
});


init();
