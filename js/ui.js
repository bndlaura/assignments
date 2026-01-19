import { toggleFavorite, getFavorites } from './storage.js';

export function renderCountries(countries, container, onFavChanged) {
  container.innerHTML = '';

  countries.forEach(c => {
    const div = document.createElement('div');
    div.className = 'country-card';

    div.innerHTML = `
      <div class="country-card-inner">
        <img src="${c.flags.png}" alt="flag" class="flag" />

        <div class="country-info">
          <h2>${c.name.common}</h2>
          <p><strong>Capital:</strong> ${c.capital?.[0] || '-'}</p>
          <p><strong>Language:</strong> ${Object.values(c.languages || {}).join(', ')}</p>
          <p><strong>Population:</strong> ${c.population.toLocaleString()}</p>
        </div>

        <button class="fav-action" type="button" data-code="${c.cca3}">
          ${getFavorites().includes(c.cca3) ? '★' : '☆'}
        </button>
      </div>
    `;

    div.querySelector('.fav-action').onclick = (e) => {
      toggleFavorite(c.cca3);

      const isFav = getFavorites().includes(c.cca3);
      e.target.textContent = isFav ? '★' : '☆';

      if (typeof onFavChanged === 'function') onFavChanged();
    };

    container.appendChild(div);
  });
}


export function renderHistory(history, container, onClick) {
  container.innerHTML = '';
  history.forEach(term => {
    const p = document.createElement('p');
    p.className = 'history-item';
    p.textContent = term;
    p.onclick = () => onClick(term);
    container.appendChild(p);
  });
}
