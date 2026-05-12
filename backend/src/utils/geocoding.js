// backend/src/utils/geocoding.js
import axios from 'axios';

const getGeoapifyApiKey = () => {
  const apiKey = process.env.GEOAPIFY_GEOCODING_KEY || process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Lipsește GEOAPIFY_GEOCODING_KEY sau GEOAPIFY_API_KEY din fișierul .env'
    );
  }
  return apiKey;
};

export async function geocode(city) {
  const apiKey = getGeoapifyApiKey();

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&format=json&apiKey=${apiKey}`;

  console.log('📡 Se încearcă geocodarea pentru:', city);

  try {
    const response = await axios.get(url);
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error(`Localitatea "${city}" nu a fost găsită.`);
    }
    const { lat, lon } = response.data.results[0];
    return { lat, lon };
  } catch (error) {
    console.error('❌ Eroare Geoapify:', error.response?.status, error.response?.data);
    throw new Error(`Nu am putut geocoda localitatea: ${city}`);
  }
}

export async function searchLocationSuggestions(query, limit = 8) {
  const apiKey = getGeoapifyApiKey();
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 12);
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(normalizedQuery)}&format=json&limit=${safeLimit}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data?.results ?? [];
    const seen = new Set();

    return results
      .map((item) => {
        const title = item.city || item.town || item.village || item.hamlet || item.name || item.address_line1;
        if (!title) {
          return null;
        }

        const location = {
          id: item.place_id || `${item.lat}-${item.lon}-${title}`,
          name: title,
          displayName: item.formatted || title,
          lat: item.lat,
          lng: item.lon,
          county: item.county || item.state || '',
          country: item.country || '',
        };

        const dedupeKey = `${location.name.toLowerCase()}|${location.county.toLowerCase()}|${location.country.toLowerCase()}`;
        if (seen.has(dedupeKey)) {
          return null;
        }
        seen.add(dedupeKey);
        return location;
      })
      .filter(Boolean);
  } catch (error) {
    console.error('❌ Eroare la autocomplete Geoapify:', error.response?.status, error.response?.data);
    throw new Error('Nu am putut încărca sugestiile de locații.');
  }
}
