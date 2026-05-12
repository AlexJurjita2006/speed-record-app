import axios from 'axios';

const LEGAL_SPEEDS_KMH = {
  city: 50,
  outside: 90,
  motorway: 130,
};

const inferRoadType = (step = {}) => {
  const streetName = String(step.instruction?.street_name || '').toLowerCase();
  const instructionText = String(step.instruction?.text || '').toLowerCase();
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
    const steps = (route.properties.legs?.[0]?.steps || []).map((step) => ({
      instruction: step.instruction?.text || '',
      distance: step.distance,
      duration: step.duration,
      wayPoint: step.way_point,
      direction: step.instruction?.direction || 'straight',
      street_name: step.instruction?.street_name || '',
    }));
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
