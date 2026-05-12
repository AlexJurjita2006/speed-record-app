import api from './api';

export const LEGAL_SPEEDS_KMH = {
  city: 50,
  outside: 90,
  motorway: 130,
};

export const inferRoadTypeFromStep = (step = {}) => {
  const streetName = String(step.street_name || '').toLowerCase();
  const instruction = String(step.instruction || '').toLowerCase();
  const haystack = `${streetName} ${instruction}`;

  if (/\bautostrad|motorway|\ba\d{1,2}\b/.test(haystack)) {
    return 'motorway';
  }

  if (/\bdn\d*|drum național|\be\d{1,3}\b/.test(haystack)) {
    return 'outside';
  }

  return 'city';
};

export const getLegalSpeedForStep = (step) => LEGAL_SPEEDS_KMH[inferRoadTypeFromStep(step)] || LEGAL_SPEEDS_KMH.outside;

/**
 * Cere ruta cu pași de la backend.
 * @param {number} startLat, startLon, endLat, endLon
 * @returns {Promise<Object>} { geometry, distanceKm, durationMinutes, steps }
 */
export const fetchNavigationRoute = async (startLat, startLon, endLat, endLon) => {
  const response = await api.get('/routes/navigate', {
    params: { startLat, startLon, endLat, endLon }
  });
  return response.data;
};

/**
 * Găsește următoarea manevră pe baza poziției curente.
 * @param {Object} currentPos {lat, lng}
 * @param {Array} steps - pașii rutei
 * @param {Array} fullCoordinates - array de [lng, lat] din geometria rutei
 * @returns {Object|null} { instruction, distance, direction, street_name }
 */
export const findNextInstruction = (currentPos, steps, fullCoordinates) => {
  if (!steps.length || !fullCoordinates.length) return null;

  // Convertim poziția curentă în [lng, lat] pentru comparare
  const pos = [currentPos.lng, currentPos.lat];

  // Căutăm cel mai apropiat punct de pe traseu
  let closestIdx = 0;
  let minDist = Infinity;
  for (let i = 0; i < fullCoordinates.length; i++) {
    const d = getDistanceMeters(pos, fullCoordinates[i]);
    if (d < minDist) {
      minDist = d;
      closestIdx = i;
    }
  }

  // Găsim primul pas al cărui way_point este în fața poziției noastre
  for (const step of steps) {
    if (step.wayPoint > closestIdx) {
      // Calculează distanța rămasă până la acest pas
      let distToStep = 0;
      for (let i = closestIdx; i < Math.min(step.wayPoint, fullCoordinates.length - 1); i++) {
        distToStep += getDistanceMeters(fullCoordinates[i], fullCoordinates[i + 1]);
      }
      return {
        instruction: step.instruction,
        distance: distToStep,  // metri
        direction: step.direction,
        street_name: step.street_name,
      };
    }
  }

  // Dacă am depășit ultimul pas, am ajuns la destinație
  return {
    instruction: 'Ai ajuns la destinație.',
    distance: 0,
    direction: 'arrived',
    street_name: '',
  };
};

/**
 * Calculează distanța în metri între două puncte [lng, lat].
 */
export function getDistanceMeters([lng1, lat1], [lng2, lat2]) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Verifică dacă utilizatorul s-a abătut de la rută (deviație > maxDist metri).
 * @param {Object} currentPos
 * @param {Array} fullCoordinates
 * @param {number} maxDist - prag în metri (ex: 50)
 * @returns {boolean}
 */
export const isOffRoute = (currentPos, fullCoordinates, maxDist = 50) => {
  if (!fullCoordinates.length) return false;
  const pos = [currentPos.lng, currentPos.lat];
  // Caută cel mai apropiat punct
  let minDist = Infinity;
  for (const coord of fullCoordinates) {
    const d = getDistanceMeters(pos, coord);
    if (d < minDist) minDist = d;
  }
  return minDist > maxDist;
};
