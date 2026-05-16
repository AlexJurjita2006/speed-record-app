import axios from 'axios';

const LEGAL_SPEEDS_KMH = {
  city: 50,
  outside: 90,
  motorway: 130,
};

const DIRECTION_ICONS = {
  'straight': '↑',
  'left': '↰',
  'right': '↱',
  'sharp_left': '⬅️',
  'sharp_right': '➡️',
  'u_turn': '↩️',
  'roundabout': '🔄',
  'enter_roundabout': '🔄',
  'exit_roundabout': '🔄',
};

const parseInstructionDetails = (step = {}) => {
  const text = String(step.instruction?.text || '').toLowerCase();
  const direction = step.instruction?.direction || 'straight';
  const streetName = String(step.instruction?.street_name || '');
  const distance = Number(step.distance) || 0;
  
  // Detectare tip instrucțiune din text
  let type = 'turn';
  let icon = DIRECTION_ICONS[direction] || '↑';
  let description = text;

  // Giratoriu
  if (text.includes('roundabout') || text.includes('giratoriu')) {
    type = 'roundabout';
    const exitMatch = text.match(/exit\s+(\d+)|iesire\s+(\d+)/i);
    const exitNum = exitMatch ? (exitMatch[1] || exitMatch[2]) : '';
    description = exitNum 
      ? `Giratoriu: iesire ${exitNum}${streetName ? ` pe ${streetName}` : ''}`
      : `Giratoriu${streetName ? ` pe ${streetName}` : ''}`;
    icon = '🔄';
  }
  // Viraje ascuțite
  else if (text.includes('sharp left') || text.includes('strict stânga')) {
    description = `Viraj ascuțit STÂNGA pe ${streetName}`;
    icon = '⬅️';
  }
  else if (text.includes('sharp right') || text.includes('strict dreapta')) {
    description = `Viraj ascuțit DREAPTA pe ${streetName}`;
    icon = '➡️';
  }
  // Viraje normale
  else if (direction === 'left' || text.includes('left') || text.includes('stânga')) {
    description = `Stânga pe ${streetName}`;
    icon = '↰';
  }
  else if (direction === 'right' || text.includes('right') || text.includes('dreapta')) {
    description = `Dreapta pe ${streetName}`;
    icon = '↱';
  }
  // U-turn
  else if (text.includes('u-turn') || text.includes('intoarcere')) {
    description = `Întoarcere pe ${streetName}`;
    icon = '↩️';
  }
  // Merge straight
  else if (direction === 'straight' || text.includes('straight') || text.includes('înainte')) {
    description = streetName ? `Înainte pe ${streetName}` : text;
    icon = '↑';
  }

  return {
    type,
    direction,
    description,
    streetName,
    icon,
    distance,
    distanceFormatted: formatDistance(distance),
  };
};

const formatDistance = (meters) => {
  if (!meters || meters < 0) return '';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const inferRoadType = (step = {}) => {
  const streetName = String(step.street_name || '').toLowerCase();
  const instructionText = String(step.instruction || '').toLowerCase();
  const haystack = `${streetName} ${instructionText}`;

  if (/\bautostrad|motorway|\ba\d{1,2}\b/.test(haystack)) {
    return 'motorway';
  }

  if (/\bdn\d*|drum național|\be\d{1,3}\b/.test(haystack)) {
    return 'outside';
  }

  return 'city';
};

const calculateLegalDurationMinutes = (steps = [], fallbackDistanceKm = 0) => {
  if (!steps.length) {
    return (fallbackDistanceKm / LEGAL_SPEEDS_KMH.outside) * 60;
  }

  const totalSeconds = steps.reduce((acc, step) => {
    const distanceMeters = Number(step.distance) || 0;
    const roadType = inferRoadType(step);
    const speedMs = LEGAL_SPEEDS_KMH[roadType] / 3.6;
    return acc + (distanceMeters / speedMs);
  }, 0);

  return totalSeconds / 60;
};

export async function getRoute(startLat, startLon, endLat, endLon) {
  // Folosește GEOAPIFY_ROUTING_KEY, cu fallback la GEOAPIFY_API_KEY (dacă vreodată o ai)
  const apiKey = process.env.GEOAPIFY_ROUTING_KEY || process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Lipsește GEOAPIFY_ROUTING_KEY sau GEOAPIFY_API_KEY din fișierul .env'
    );
  }

  const url = `https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLon}|${endLat},${endLon}&mode=drive&details=instruction_details&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const features = response.data?.features;
    if (!features || features.length === 0) {
      throw new Error('Nu s-a găsit nicio rută între aceste puncte.');
    }

    const route = features[0];
    const distanceKm = (route.properties.distance || 0) / 1000;
    const durationMinutes = (route.properties.duration || 0) / 60;
    const geometry = route.geometry;
    const steps = (route.properties.legs?.[0]?.steps || []).map((step) => {
      const details = parseInstructionDetails(step);
      return {
        instruction: details.description,
        distance: step.distance,
        duration: step.duration,
        wayPoint: step.way_point,
        direction: details.direction,
        street_name: details.streetName,
        type: details.type,
        icon: details.icon,
        rawText: step.instruction?.text || '',
      };
    });
    const legalDurationMinutes = calculateLegalDurationMinutes(
      route.properties.legs?.[0]?.steps || [],
      distanceKm
    );

    return { distanceKm, durationMinutes, legalDurationMinutes, geometry, steps };
  } catch (error) {
    console.error('Routing error:', error.message);
    throw new Error('Nu am putut calcula ruta.');
  }
}
