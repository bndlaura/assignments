const BASE_URL = 'https://restcountries.com/v3.1';

export async function fetchAllCountries() {
  const res = await fetch(
    `${BASE_URL}/all?fields=name,capital,languages,population,cca3,flags,region`
  );
  return res.json();
}

export async function fetchCountryByName(name) {
  const res = await fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,languages,population,cca3,flags,region`
  );
  return res.json();
}
