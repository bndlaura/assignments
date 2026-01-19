import { getFavorites, toggleFavorite } from './storage.js';

const container = document.getElementById('favorites-list');

const detailsCache = new Map();

async function fetchCountryDetailsByCode(code) {
  const res = await fetch(
    `https://restcountries.com/v3.1/alpha/${code}?fields=name,capital,languages,population,region,subregion,currencies,flags,cca3`
  );
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

function renderEmpty() {
  container.innerHTML = `
    <p>No favorites yet.</p>
  `;
}

async function renderFavorites() {
  const favs = getFavorites();

  container.innerHTML = '';
  if (!favs.length) return renderEmpty();

  for (const code of favs) {
    const basic = await fetchCountryDetailsByCode(code);

    const row = document.createElement('div');
    row.className = 'fav-row';
    row.dataset.code = code;

    row.innerHTML = `
      <div class="fav-row-top">
        <img class="fav-flag" src="${basic.flags.png || ''}" alt="flag" />
        <p class="fav-name">${basic.name.common || code}</p>

        <div class="fav-actions">
          <button class="details-btn">Details</button>
          <button class="unfav-btn" title="Remove favorite">★</button>
        </div>
      </div>

      <div class="fav-details"></div>
    `;

    const detailsBtn = row.querySelector('.details-btn');
    const unfavBtn = row.querySelector('.unfav-btn');
    const detailsBox = row.querySelector('.fav-details');

    unfavBtn.onclick = () => {
      toggleFavorite(code);
      row.remove();

      if (!getFavorites().length) renderEmpty();
    };

    detailsBtn.onclick = async () => {
      const isOpen = detailsBox.style.display === 'block';

      if (isOpen) {
        detailsBox.style.display = 'none';
        detailsBtn.textContent = 'Details';
        return;
      }

      if (!detailsCache.has(code)) {
        const full = await fetchCountryDetailsByCode(code);
        detailsCache.set(code, full);
      }

      const full = detailsCache.get(code);

      const languages = Object.values(full.languages || {}).join(', ') || '-';
      const capital = full.capital?.[0] || '-';
      const currency = full.currencies
        ? Object.values(full.currencies).map(c => c.name).join(', ')
        : '-';

      detailsBox.innerHTML = `
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Language:</strong> ${languages}</p>
        <p><strong>Population:</strong> ${full.population?.toLocaleString() || '-'}</p>
        <p><strong>Region:</strong> ${full.region || '-'} ${full.subregion ? `(${full.subregion})` : ''}</p>
        <p><strong>Currency:</strong> ${currency}</p>
      `;

      detailsBox.style.display = 'block';
      detailsBtn.textContent = 'Hide';
    };

    container.appendChild(row);
  }
}

renderFavorites();
