import { geocode, searchLocationSuggestions } from '../utils/geocoding.js';
import { getRoute } from '../utils/routing.js';
import { supabaseAdmin } from '../config/supabase.js';

const parseCoordinate = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const resolveRoutePoint = async ({ city, lat, lon, label, fallbackLabel }) => {
  const parsedLat = parseCoordinate(lat);
  const parsedLon = parseCoordinate(lon);

  if (parsedLat !== null || parsedLon !== null) {
    if (parsedLat === null || parsedLon === null) {
      throw new Error('Coordonatele pentru punctul de traseu sunt incomplete.');
    }

    return {
      lat: parsedLat,
      lon: parsedLon,
      label: label?.trim() || fallbackLabel || city?.trim() || 'Locație',
    };
  }

  if (!city || !city.trim()) {
    throw new Error('Lipsește localitatea sau coordonatele pentru un punct din traseu.');
  }

  const coords = await geocode(city.trim());
  return {
    lat: coords.lat,
    lon: coords.lon,
    label: label?.trim() || city.trim(),
  };
};

// --- Funcția existentă pentru sugestii ---
export const getLocationSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.json([]);
    }
    const suggestions = await searchLocationSuggestions(query.trim());
    return res.json(suggestions);
  } catch (error) {
    console.error('Eroare sugestii:', error.message);
    return res.status(500).json({ error: 'Nu s-au putut încărca sugestiile.' });
  }
};

// --- Funcția pentru ruta simplă (cu coordonate) ---
export const getRouteInfo = async (req, res) => {
  try {
    const {
      startCity,
      endCity,
      startLat,
      startLon,
      endLat,
      endLon,
      startLabel,
      endLabel,
    } = req.query;

    if ((!startCity && (startLat === undefined || startLon === undefined)) || (!endCity && (endLat === undefined || endLon === undefined))) {
      return res.status(400).json({
        error: 'Pentru fiecare capăt al rutei sunt necesare fie numele localității, fie coordonatele GPS.',
      });
    }

    // 1. Rezolvă punctele de plecare și sosire
    let startCoords, endCoords;
    try {
      startCoords = await resolveRoutePoint({
        city: startCity,
        lat: startLat,
        lon: startLon,
        label: startLabel,
        fallbackLabel: 'Locația mea curentă',
      });
      endCoords = await resolveRoutePoint({
        city: endCity,
        lat: endLat,
        lon: endLon,
        label: endLabel,
        fallbackLabel: 'Destinație',
      });
    } catch (geoErr) {
      return res.status(404).json({ error: geoErr.message });
    }

    // 2. Obține ruta (distanță + geometrie)
    let routeData;
    try {
      routeData = await getRoute(startCoords.lat, startCoords.lon, endCoords.lat, endCoords.lon);
    } catch (routeErr) {
      return res.status(404).json({ error: routeErr.message });
    }

    // 3. Salvează în Supabase (opțional)
    const userId = req.user?.id || null;
    try {
      const { error } = await supabaseAdmin
        .from('route_searches')
        .insert({
          user_id: userId,
          origin_name: startCoords.label,
          origin_coords: `(${startCoords.lat},${startCoords.lon})`,
          destination_name: endCoords.label,
          destination_coords: `(${endCoords.lat},${endCoords.lon})`,
          route_geometry: routeData.geometry,
          distance_km: routeData.distanceKm,
          duration_minutes: routeData.durationMinutes,
        });

      if (error) {
        console.error('Eroare la salvarea căutării:', error.message);
      }
    } catch (dbErr) {
      console.error('Eroare la inserare:', dbErr.message);
    }

    // 4. Răspuns cu coordonate incluse
    res.json({
      startCity: startCoords.label,
      endCity: endCoords.label,
      startLat: startCoords.lat,
      startLon: startCoords.lon,
      endLat: endCoords.lat,
      endLon: endCoords.lon,
      geometry: routeData.geometry,
      distanceKm: routeData.distanceKm,
      durationMinutes: routeData.durationMinutes,
      legalDurationMinutes: routeData.legalDurationMinutes,
    });

  } catch (error) {
    console.error('Eroare getRouteInfo:', error);
    res.status(500).json({ error: 'Eroare internă.' });
  }
};

// --- Funcția pentru navigare (cu pași) ---
export const getNavigationRoute = async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon } = req.query;
    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({ error: 'Parametrii de coordonate lipsesc.' });
    }

    let routeData;
    try {
      routeData = await getRoute(startLat, startLon, endLat, endLon);
    } catch (routeErr) {
      return res.status(404).json({ error: routeErr.message });
    }

    return res.json({
      geometry: routeData.geometry,
      distanceKm: routeData.distanceKm,
      durationMinutes: routeData.durationMinutes,
      legalDurationMinutes: routeData.legalDurationMinutes,
      steps: routeData.steps,
    });
  } catch (error) {
    console.error('Eroare navigare:', error.message);
    return res.status(500).json({ error: 'Eroare la obținerea rutei de navigare.' });
  }
};
