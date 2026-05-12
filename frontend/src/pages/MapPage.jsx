import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import RouteSearch from '../components/RouteSearch';
import Map from '../components/Map';
import NavigationPanel from '../components/NavigationPanel';
import {
  fetchNavigationRoute,
  findNextInstruction,
  getDistanceMeters,
  getLegalSpeedForStep,
  LEGAL_SPEEDS_KMH,
} from '../services/navigationService';
import './MapPage.css';

const isCoordinatePoint = (point) =>
  Boolean(
    point &&
    typeof point === 'object' &&
    Number.isFinite(Number(point.lat)) &&
    Number.isFinite(Number(point.lng))
  );

const resolvePointLabel = (point) => {
  if (typeof point === 'string') {
    return point.trim();
  }

  if (!point || typeof point !== 'object') {
    return '';
  }

  return (point.label || point.name || point.displayName || '').trim();
};

const formatDuration = (minutes) => {
  const totalMinutes = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${remainingMinutes}m`;
};

const getRouteDurationMinutes = (route) => {
  const legalDuration = Number(route?.legalDurationMinutes);
  if (Number.isFinite(legalDuration) && legalDuration > 0) {
    return legalDuration;
  }

  const backendDuration = Number(route?.durationMinutes);
  if (Number.isFinite(backendDuration) && backendDuration > 0) {
    return backendDuration;
  }

  const distanceKm = Number(route?.distanceKm);
  if (Number.isFinite(distanceKm) && distanceKm > 0) {
    return (distanceKm / LEGAL_SPEEDS_KMH.outside) * 60;
  }

  return 0;
};

const calculateRemainingMetrics = (currentPos, steps, coordinates) => {
  if (!currentPos || !coordinates.length) {
    return { distanceMeters: 0, etaSeconds: 0 };
  }

  const currentPoint = [currentPos.lng, currentPos.lat];
  let closestIdx = 0;
  let minDist = Number.POSITIVE_INFINITY;

  coordinates.forEach((coord, index) => {
    const distance = getDistanceMeters(currentPoint, coord);
    if (distance < minDist) {
      minDist = distance;
      closestIdx = index;
    }
  });

  const hasSteps = steps.length > 0;
  let stepIdx = 0;
  while (hasSteps && stepIdx < steps.length && (Number(steps[stepIdx]?.wayPoint) || 0) <= closestIdx) {
    stepIdx += 1;
  }

  let distanceMeters = 0;
  let etaSeconds = 0;

  for (let i = closestIdx; i < coordinates.length - 1; i += 1) {
    while (hasSteps && stepIdx < steps.length && (Number(steps[stepIdx]?.wayPoint) || 0) <= i) {
      stepIdx += 1;
    }

    const activeStep = hasSteps ? steps[Math.min(stepIdx, steps.length - 1)] : null;
    const segmentDistance = getDistanceMeters(coordinates[i], coordinates[i + 1]);
    const speedMs = getLegalSpeedForStep(activeStep) / 3.6;

    distanceMeters += segmentDistance;
    etaSeconds += segmentDistance / speedMs;
  }

  return { distanceMeters, etaSeconds };
};

function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [departureMode, setDepartureMode] = useState('depart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Stări navigare
  const [navigating, setNavigating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [nextInstruction, setNextInstruction] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [eta, setEta] = useState('');
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [fullNavCoordinates, setFullNavCoordinates] = useState([]); // [lng, lat]
  const watchIdRef = useRef(null);

  const popularRoutes = [
    { id: 1, name: 'Ineu → Timișoara', origin: 'Ineu', destination: 'Timișoara', distance: 42.5, difficulty: 'Ușor' },
    { id: 2, name: 'București → Brașov', origin: 'București', destination: 'Brașov', distance: 142.0, difficulty: 'Mediu' },
    { id: 3, name: 'Cluj → Sibiu', origin: 'Cluj', destination: 'Sibiu', distance: 130.5, difficulty: 'Mediu' },
    { id: 4, name: 'Transfăgărășan', origin: 'Curtea de Argeș', destination: 'Bălea Lac', distance: 150.0, difficulty: 'Greu' },
    { id: 5, name: 'Transalpina', origin: 'Petroșani', destination: 'Sebeș', distance: 146.0, difficulty: 'Greu' },
  ];

  const handleSearch = async (searchData) => {
    const { origin, destination, departureOption } = searchData;
    const originLabel = resolvePointLabel(origin);
    const destinationLabel = resolvePointLabel(destination);

    if (!originLabel || !destinationLabel) {
      setError('Completează ambele localități');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedRoute(null);
    stopNavigation(); // oprește orice navigare anterioară

    try {
      const params = isCoordinatePoint(origin)
        ? {
            startLat: Number(origin.lat),
            startLon: Number(origin.lng),
            startLabel: originLabel,
          }
        : {
            startCity: originLabel,
          };

      if (isCoordinatePoint(destination)) {
        params.endLat = Number(destination.lat);
        params.endLon = Number(destination.lng);
        params.endLabel = destinationLabel;
      } else {
        params.endCity = destinationLabel;
      }

      const response = await api.get('/routes', { params });

      setDepartureMode(departureOption === 'Pleacă acum' ? 'depart' : 'arrive');
      setSelectedRoute(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Eroare la obținerea rutei');
    } finally {
      setLoading(false);
    }
  };

  const startNavigation = useCallback(async () => {
    if (!selectedRoute || !selectedRoute.startLat || !selectedRoute.endLat) {
      setError('Coordonatele rutei lipsesc. Reîncarcă ruta.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const navData = await fetchNavigationRoute(
        selectedRoute.startLat,
        selectedRoute.startLon,
        selectedRoute.endLat,
        selectedRoute.endLon
      );

      setNavigationSteps(navData.steps);
      setFullNavCoordinates(navData.geometry.coordinates); // array de [lng, lat]

      // Pornim GPS-ul
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            setCurrentPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => console.error('Eroare GPS:', err),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        watchIdRef.current = id;
      } else {
        alert('Geolocația nu este suportată de browser.');
      }

      setNavigating(true);
    } catch (err) {
      console.error(err);
      setError('Eroare la inițierea navigării.');
    } finally {
      setLoading(false);
    }
  }, [selectedRoute]);

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setNavigating(false);
    setCurrentPosition(null);
    setNextInstruction(null);
    setNavigationSteps([]);
    setFullNavCoordinates([]);
  }, []);

  const handleRecalculate = useCallback(async () => {
    if (!currentPosition || !selectedRoute) return;
    try {
      const navData = await fetchNavigationRoute(
        currentPosition.lat,
        currentPosition.lng,
        selectedRoute.endLat,
        selectedRoute.endLon
      );
      setNavigationSteps(navData.steps);
      setFullNavCoordinates(navData.geometry.coordinates);
      // Actualizăm ruta din selectedRoute? Opțional, pentru coerență vizuală.
      setSelectedRoute(prev => ({
        ...prev,
        geometry: navData.geometry,
        distanceKm: navData.distanceKm,
        durationMinutes: navData.durationMinutes,
        legalDurationMinutes: navData.legalDurationMinutes,
        startLat: currentPosition.lat,
        startLon: currentPosition.lng,
      }));
    } catch (err) {
      console.error('Rerutare eșuată:', err);
    }
  }, [currentPosition, selectedRoute]);

  // Actualizează instrucțiunea următoare + distanța rămasă + ETA
  useEffect(() => {
    if (!navigating || !currentPosition || !navigationSteps.length || !fullNavCoordinates.length) return;

    const next = findNextInstruction(currentPosition, navigationSteps, fullNavCoordinates);
    setNextInstruction(next);

    const { distanceMeters, etaSeconds } = calculateRemainingMetrics(
      currentPosition,
      navigationSteps,
      fullNavCoordinates
    );
    setRemainingDistance(distanceMeters);

    const etaDate = new Date(Date.now() + etaSeconds * 1000);
    setEta(
      etaDate.toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, [currentPosition, navigationSteps, fullNavCoordinates, navigating]);

  // Cleanup la unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const routeDurationMinutes = selectedRoute ? getRouteDurationMinutes(selectedRoute) : 0;
  const routeDurationText = selectedRoute ? formatDuration(routeDurationMinutes) : '';
  const estimatedArrivalTime = selectedRoute
    ? new Date(Date.now() + routeDurationMinutes * 60000).toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`map-page ${navigating ? 'map-page--navigating' : ''}`}>
      <div className="map-page__overlay">
        {!navigating && (
          <div className="map-page__search-panel">
            <RouteSearch onSearch={handleSearch} popularRoutes={popularRoutes} />
            {loading && <p className="map-page__loading-text">Se calculează ruta...</p>}
            {error && <p className="map-page__error-text">{error}</p>}

            {selectedRoute && (
              <div className="map-page__route-info-panel">
                <div className="map-page__route-info-item">
                  <span className="map-page__info-label">Rută:</span>
                  <span className="map-page__info-value">
                    {selectedRoute.startCity} → {selectedRoute.endCity}
                  </span>
                </div>

                <div className="map-page__route-info-item">
                  <span className="map-page__info-label">Distanță:</span>
                  <span className="map-page__info-value">{Number(selectedRoute.distanceKm).toFixed(1)} km</span>
                </div>

                {selectedRoute && routeDurationText && (
                  <div className="map-page__route-info-item">
                    <span className="map-page__info-label">
                      {departureMode === 'depart' ? 'Timp estimat' : 'Sosire estimată'}:
                    </span>
                    <span className="map-page__info-value">
                      {departureMode === 'depart' ? routeDurationText : estimatedArrivalTime}
                      <span className="map-page__info-sublabel">
                        {departureMode === 'depart'
                          ? 'calculat cu limite legale'
                          : `durată ${routeDurationText}`}
                      </span>
                    </span>
                  </div>
                )}

                <button className="map-page__navigate-btn" onClick={startNavigation}>
                  Începe navigarea
                </button>
              </div>
            )}
          </div>
        )}

        <div className="map-page__map-container">
          <Map
            key={selectedRoute?.id || 'empty'}
            origin={selectedRoute?.startCity}
            destination={selectedRoute?.endCity}
            routeData={selectedRoute}
            navigationMode={navigating}
            currentPosition={currentPosition}
            followUser={navigating}
            onRecalculate={handleRecalculate}
          />
          {navigating && (
            <div className="map-page__nav-overlay">
              <NavigationPanel
                instruction={nextInstruction?.instruction || 'Continuă'}
                distance={nextInstruction?.distance || 0}
                direction={nextInstruction?.direction || 'straight'}
                streetName={nextInstruction?.street_name}
                eta={eta}
                totalDistance={remainingDistance}
                onStop={stopNavigation}
                compact
              />
            </div>
          )}
          {error && navigating && <p className="map-page__error-text map-page__error-text--floating">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
