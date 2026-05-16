import { useEffect, useMemo, useState, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import { isOffRoute } from '../services/navigationService';
import './Map.css';

const DEFAULT_CENTER = [45.9432, 24.9668];
const DEFAULT_ZOOM = 6;

const createMarkerIcon = (color) =>
  L.divIcon({
    className: 'map__leaflet-marker',
    html: `<span style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  });

const FitBoundsToRoute = ({ positions, localMarker, navigationMode }) => {
  const map = useMap();

  useEffect(() => {
    // Nu face fitBounds dacă suntem în mod navigare (urmează utilizatorul)
    if (navigationMode) return;

    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      return;
    }

    if (localMarker) {
      map.setView([localMarker.lat, localMarker.lng], Math.max(map.getZoom(), 11), {
        animate: true,
      });
    }
  }, [map, positions, localMarker, navigationMode]);

  return null;
};

const MapClickHandler = ({ onMapClick, setLocalMarker }) => {
  useMapEvents({
    click(event) {
      const point = { lat: event.latlng.lat, lng: event.latlng.lng };
      setLocalMarker(point);

      if (onMapClick) {
        onMapClick(point);
      }
    },
  });

  return null;
};

function Map({
  origin = null,
  destination = null,
  routeData = null,
  onMapClick = null,
  // Noile proprietăți pentru navigare
  navigationMode = false,
  currentPosition = null,
  navigationPathCoordinates = null, // array [lng, lat] (ruta rămasă)
  offRouteCoordinates = null, // array [lng, lat] (ruta completă pentru abatere)
  followUser = true,
  onRecalculate = null,
}) {
  const [fetchedRoute, setFetchedRoute] = useState(null);
  const [error, setError] = useState('');
  const [localMarker, setLocalMarker] = useState(null);
  const [activeLayer, setActiveLayer] = useState('standard');

  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  const resolvedRoute = routeData ?? fetchedRoute;
  const routeCoordinates = useMemo(() => {
    if (navigationMode && Array.isArray(navigationPathCoordinates) && navigationPathCoordinates.length) {
      return navigationPathCoordinates
        .map((point) => {
          if (!Array.isArray(point) || point.length < 2) {
            return null;
          }
          const [lon, lat] = point;
          if (typeof lat !== 'number' || typeof lon !== 'number') {
            return null;
          }
          return [lat, lon];
        })
        .filter(Boolean);
    }

    const geometry = resolvedRoute?.geometry;
    const coordinates = geometry?.coordinates;

    if (!geometry || !Array.isArray(coordinates)) {
      return [];
    }

    const rawPoints =
      geometry.type === 'LineString'
        ? coordinates
        : geometry.type === 'MultiLineString'
          ? coordinates.flatMap((segment) => (Array.isArray(segment) ? segment : []))
          : [];

    return rawPoints
      .map((point) => {
        if (!Array.isArray(point) || point.length < 2) {
          return null;
        }
        const [lon, lat] = point;
        if (typeof lat !== 'number' || typeof lon !== 'number') {
          return null;
        }
        return [lat, lon]; // format [lat, lng] pentru Leaflet
      })
      .filter(Boolean);
  }, [resolvedRoute, navigationMode, navigationPathCoordinates]);

  // Convertim coordonatele înapoi în [lng, lat] pentru verificarea abaterii
  const routeCoordinatesLngLat = useMemo(
    () => routeCoordinates.map(([lat, lng]) => [lng, lat]),
    [routeCoordinates]
  );
  const offRouteCoordinatesLngLat = useMemo(() => {
    if (Array.isArray(offRouteCoordinates) && offRouteCoordinates.length) {
      return offRouteCoordinates;
    }
    return routeCoordinatesLngLat;
  }, [offRouteCoordinates, routeCoordinatesLngLat]);
  const fullNavigationCoordinates = useMemo(() => {
    if (!navigationMode || !Array.isArray(offRouteCoordinates) || !offRouteCoordinates.length) {
      return [];
    }

    return offRouteCoordinates
      .map((point) => {
        if (!Array.isArray(point) || point.length < 2) {
          return null;
        }

        const [lon, lat] = point;
        if (typeof lat !== 'number' || typeof lon !== 'number') {
          return null;
        }

        return [lat, lon];
      })
      .filter(Boolean);
  }, [navigationMode, offRouteCoordinates]);

  const routeStart = routeCoordinates[0] ?? null;
  const routeEnd = routeCoordinates[routeCoordinates.length - 1] ?? null;

  // Încărcare rută normală (căutare)
  useEffect(() => {
    if (routeData || !origin || !destination) {
      return;
    }

    const controller = new AbortController();

    api
      .get('/routes', {
        params: { startCity: origin, endCity: destination },
        signal: controller.signal,
      })
      .then((response) => {
        setFetchedRoute(response.data);
      })
      .catch((requestError) => {
        if (requestError.code === 'ERR_CANCELED') {
          return;
        }

        setFetchedRoute(null);
        setError(requestError.response?.data?.error || 'Nu am putut încărca ruta.');
      });

    return () => controller.abort();
  }, [origin, destination, routeData]);

  // Urmărire utilizator
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (navigationMode && currentPosition && followUser) {
      map.setView([currentPosition.lat, currentPosition.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [navigationMode, currentPosition, followUser]);

  // Marcaj utilizator
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (currentPosition) {
      if (!userMarkerRef.current) {
        const icon = L.divIcon({
          className: 'map__leaflet-marker map__user-marker',
          html: `<span style="background:#0055ff; border-radius:50%; width:16px; height:16px; display:block;"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([currentPosition.lat, currentPosition.lng], { icon }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([currentPosition.lat, currentPosition.lng]);
      }
    }

    return () => {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    };
  }, [currentPosition]);

  // Detectare abatere și rerutare
  useEffect(() => {
    if (!navigationMode || !currentPosition || !offRouteCoordinatesLngLat.length || !onRecalculate) return;

    const checkOffRoute = () => {
      if (isOffRoute(currentPosition, offRouteCoordinatesLngLat, 50)) {
        onRecalculate();
      }
    };

    const timer = setInterval(checkOffRoute, 3000);
    return () => clearInterval(timer);
  }, [navigationMode, currentPosition, offRouteCoordinatesLngLat, onRecalculate]);

  const isLoading = Boolean(origin && destination && !resolvedRoute && !error);

  const tileLayer =
    activeLayer === 'satellite'
      ? {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri',
        }
      : {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };

  return (
    <div className="map">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="map__leaflet"
        scrollWheelZoom
        whenReady={(mapInstance) => {
          mapRef.current = mapInstance.target;
        }}
      >
        {!navigationMode && <MapClickHandler onMapClick={onMapClick} setLocalMarker={setLocalMarker} />}
        <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />

        <FitBoundsToRoute
          positions={routeCoordinates}
          localMarker={localMarker}
          navigationMode={navigationMode}
        />

        {navigationMode && fullNavigationCoordinates.length >= 2 && (
          <Polyline positions={fullNavigationCoordinates} pathOptions={{ color: '#0f172a', weight: 6, opacity: 0.35 }} />
        )}

        {routeCoordinates.length >= 2 && (
          navigationMode ? (
            <Polyline positions={routeCoordinates} pathOptions={{ color: '#2f80ff', weight: 7 }} />
          ) : (
            <>
              <Polyline positions={routeCoordinates} pathOptions={{ color: '#0f172a', weight: 9, opacity: 0.65 }} />
              <Polyline positions={routeCoordinates} pathOptions={{ color: '#2f80ff', weight: 6 }} />
            </>
          )
        )}

        {!navigationMode && routeStart && (
          <Marker position={routeStart} icon={createMarkerIcon('#00ff88')}>
            <Popup>
              <strong>🏁 Start</strong>
              <br />
              {origin || resolvedRoute?.startCity || 'Start'}
            </Popup>
          </Marker>
        )}

        {!navigationMode && routeEnd && (
          <Marker position={routeEnd} icon={createMarkerIcon('#ff3355')}>
            <Popup>
              <strong>🏎️ Final</strong>
              <br />
              {destination || resolvedRoute?.endCity || 'Destinație'}
            </Popup>
          </Marker>
        )}

        {localMarker && (
          <Marker position={[localMarker.lat, localMarker.lng]} icon={createMarkerIcon('#ffd43b')}>
            <Popup>
              <strong>📍 Punct selectat</strong>
              <br />
              {localMarker.lat.toFixed(5)}, {localMarker.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {isLoading && (
        <div className="map__loading">
          <div className="map__spinner" />
        </div>
      )}

      {error && <div className="map__error">{error}</div>}

      <div className={`map__controls ${navigationMode ? 'map__controls--navigation' : ''}`}>
        <button
          className={`map__control-btn ${activeLayer === 'standard' ? 'map__control-btn--active' : ''}`}
          onClick={() => setActiveLayer('standard')}
          title="Hartă standard"
          type="button"
        >
          🗺️
        </button>
        <button
          className={`map__control-btn ${activeLayer === 'satellite' ? 'map__control-btn--active' : ''}`}
          onClick={() => setActiveLayer('satellite')}
          title="Hartă alternativă"
          type="button"
        >
          🛰️
        </button>
        {!navigationMode && (
          <button
            className="map__control-btn"
            onClick={() => setLocalMarker(null)}
            title="Șterge markerul local"
            type="button"
          >
            🔄
          </button>
        )}
      </div>

      <div className={`map__legend ${navigationMode ? 'map__legend--hidden' : ''}`}>
        <div className="map__legend-item">
          <span className="map__legend-color" style={{ '--color': 'var(--color-accent-tertiary)' }} />
          Punct de start
        </div>
        <div className="map__legend-item">
          <span className="map__legend-color" style={{ '--color': 'var(--color-accent-secondary)' }} />
          Destinație
        </div>
        <div className="map__legend-item">
          <span className="map__legend-color" style={{ '--color': 'var(--color-accent-gold)' }} />
          Marker local
        </div>
      </div>
    </div>
  );
}

export default Map;
