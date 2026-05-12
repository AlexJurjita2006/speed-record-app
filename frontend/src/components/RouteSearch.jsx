import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
import './RouteSearch.css';

const FALLBACK_LOCATIONS = [
  { id: 1, name: 'București', displayName: 'București, România', county: 'București', country: 'România' },
  { id: 2, name: 'Cluj-Napoca', displayName: 'Cluj-Napoca, Cluj, România', county: 'Cluj', country: 'România' },
  { id: 3, name: 'Timișoara', displayName: 'Timișoara, Timiș, România', county: 'Timiș', country: 'România' },
  { id: 4, name: 'Iași', displayName: 'Iași, România', county: 'Iași', country: 'România' },
  { id: 5, name: 'Brașov', displayName: 'Brașov, România', county: 'Brașov', country: 'România' },
  { id: 6, name: 'Sibiu', displayName: 'Sibiu, România', county: 'Sibiu', country: 'România' },
];

const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function RouteSearch({ onSearch, popularRoutes = [] }) {
  const [origin, setOrigin] = useState('');
  const [originMode, setOriginMode] = useState('manual');
  const [currentOriginCoords, setCurrentOriginCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [locationMessage, setLocationMessage] = useState('');
  const [destination, setDestination] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDepartureMenu, setShowDepartureMenu] = useState(false);
  const [departureOption, setDepartureOption] = useState('Pleacă acum');
  const [errors, setErrors] = useState({});
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('speedrecord_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  });

  const formRef = useRef(null);
  const suggestionsRef = useRef(null);
  const departureRef = useRef(null);
  const originInputRef = useRef(null);
  const destInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeQuery = useMemo(() => {
    if (focusedField === 'origin') {
      return origin;
    }
    if (focusedField === 'destination') {
      return destination;
    }
    return '';
  }, [focusedField, origin, destination]);

  const quickSuggestions = useMemo(
    () =>
      recentSearches
        .slice(0, 5)
        .flatMap((item) => [
          {
            id: `${item.origin}-${item.timestamp}-origin`,
            name: item.origin,
            displayName: item.origin,
            county: 'Căutare recentă',
          },
          {
            id: `${item.destination}-${item.timestamp}-destination`,
            name: item.destination,
            displayName: item.destination,
            county: 'Căutare recentă',
          },
        ]),
    [recentSearches]
  );

  const displaySuggestions = activeQuery.trim() ? suggestions : quickSuggestions;

  const handleInputChange = (value, field) => {
    if (field === 'origin') {
      setOrigin(value);
      if (originMode === 'current-location') {
        setOriginMode('manual');
        setCurrentOriginCoords(null);
        setLocationStatus('idle');
        setLocationMessage('');
      }
    } else {
      setDestination(value);
    }

    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationMessage('Browserul nu suportă locația GPS.');
      return;
    }

    setLocationStatus('loading');
    setLocationMessage('Se citește locația curentă...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setOrigin('Locația mea curentă');
        setOriginMode('current-location');
        setCurrentOriginCoords(coords);
        setLocationStatus('ready');
        setLocationMessage(`GPS activ: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}.`);
        setShowSuggestions(false);
        setFocusedField('origin');
        setErrors((prev) => ({ ...prev, origin: '' }));
      },
      (error) => {
        console.error('Eroare la obținerea locației curente:', error);
        setLocationStatus('error');
        setCurrentOriginCoords(null);
        setLocationMessage('Nu am putut accesa locația. Permite accesul și încearcă din nou.');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!focusedField || !showSuggestions) {
      return;
    }

    if (!activeQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const localSuggestions = FALLBACK_LOCATIONS.filter((location) => {
      const value = normalizeText(activeQuery);
      return (
        normalizeText(location.name).includes(value) ||
        normalizeText(location.displayName).includes(value) ||
        normalizeText(location.county).includes(value)
      );
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await api.get('/routes/search', {
          params: { query: activeQuery.trim() },
          signal: controller.signal,
        });

        const oppositeValue = focusedField === 'origin' ? destination : origin;
        const normalizedOpposite = normalizeText(oppositeValue);
        const remoteSuggestions = (response.data || []).filter(
          (item) => normalizeText(item?.name || '') !== normalizedOpposite
        );

        setSuggestions(remoteSuggestions.length > 0 ? remoteSuggestions : localSuggestions);
        setActiveSuggestionIndex(-1);
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return;
        }
        setSuggestions(localSuggestions);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [activeQuery, focusedField, showSuggestions, origin, destination]);

  const handleSuggestionClick = (suggestion, field, shouldSearch = false) => {
    if (field === 'origin') {
      setOrigin(suggestion.name);
      setOriginMode('manual');
      setCurrentOriginCoords(null);
      setLocationStatus('idle');
      setLocationMessage('');
    } else {
      setDestination(suggestion.name);
    }
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);

    // Focus pe următorul câmp
    if (field === 'origin' && destInputRef.current) {
      destInputRef.current.focus();
    }

    if (shouldSearch) {
      triggerSearch(field === 'origin' ? suggestion.name : origin, field === 'destination' ? suggestion.name : destination);
    }
  };

  const handleKeyDown = (e, field) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < displaySuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : displaySuggestions.length - 1
        );
        break;
      
      case 'Enter':
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < displaySuggestions.length) {
          e.preventDefault();
          handleSuggestionClick(displaySuggestions[activeSuggestionIndex], field, field === 'destination');
          return;
        }
        e.preventDefault();
        triggerSearch();
        break;

      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
      
      default:
        break;
    }
  };

  const handleSwap = () => {
    if (originMode === 'current-location') {
      setLocationStatus('error');
      setLocationMessage('Inversează ruta doar după ce alegi un punct de pornire manual.');
      return;
    }

    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    
    if (originInputRef.current) {
      originInputRef.current.style.transform = 'scale(1.02)';
      setTimeout(() => {
        if (originInputRef.current) {
          originInputRef.current.style.transform = 'scale(1)';
        }
      }, 150);
    }
  };

  const validateForm = (nextOrigin = origin, nextDestination = destination) => {
    const newErrors = {};

    if (originMode === 'current-location') {
      if (!currentOriginCoords) {
        newErrors.origin = 'Nu am putut folosi locația curentă. Încearcă din nou.';
      }
    } else if (!nextOrigin.trim()) {
      newErrors.origin = 'Selectează punctul de plecare';
    }

    if (!nextDestination.trim()) {
      newErrors.destination = 'Selectează punctul de destinație';
    }

    if (
      nextOrigin.trim() &&
      nextDestination.trim() &&
      normalizeText(nextOrigin) === normalizeText(nextDestination)
    ) {
      newErrors.destination = 'Destinația trebuie să fie diferită de origine';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerSearch = (nextOrigin = origin, nextDestination = destination) => {
    if (!validateForm(nextOrigin, nextDestination)) {
      return;
    }

    const resolvedOrigin = originMode === 'current-location' && currentOriginCoords
      ? {
          type: 'current-location',
          label: nextOrigin.trim() || 'Locația mea curentă',
          lat: currentOriginCoords.lat,
          lng: currentOriginCoords.lng,
        }
      : {
          type: 'manual',
          label: nextOrigin.trim(),
        };

    const resolvedDestination = {
      type: 'manual',
      label: nextDestination.trim(),
    };

    const newSearch = {
      origin: resolvedOrigin.label,
      destination: resolvedDestination.label,
      timestamp: Date.now(),
    };

    if (resolvedOrigin.type !== 'current-location') {
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(
          (s) =>
            !(
              normalizeText(s.origin) === normalizeText(newSearch.origin) &&
              normalizeText(s.destination) === normalizeText(newSearch.destination)
            )
        )
      ].slice(0, 5); // Păstrează doar ultimele 5

      setRecentSearches(updatedSearches);
      localStorage.setItem('speedrecord_recent_searches', JSON.stringify(updatedSearches));
    }

    if (onSearch) {
      onSearch({ origin: resolvedOrigin, destination: resolvedDestination, departureOption });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  const handleClear = (field) => {
    if (field === 'origin') {
      setOrigin('');
      setOriginMode('manual');
      setCurrentOriginCoords(null);
      setLocationStatus('idle');
      setLocationMessage('');
      if (originInputRef.current) {
        originInputRef.current.focus();
      }
    } else {
      setDestination('');
      if (destInputRef.current) {
        destInputRef.current.focus();
      }
    }
    setErrors({});
  };

  const clearAll = () => {
    setOrigin('');
    setDestination('');
    setOriginMode('manual');
    setCurrentOriginCoords(null);
    setLocationStatus('idle');
    setLocationMessage('');
    setErrors({});
    setShowSuggestions(false);
  };

  return (
    <div className="route-search" ref={formRef}>
      <div className="route-search__container">
        <div className="route-search__header">
          <button type="button" className="route-search__menu-btn" aria-label="Meniu">
            ☰
          </button>
          <h2 className="route-search__title">Direcții de conducere</h2>
        </div>

        <form className="route-search__form" onSubmit={handleSubmit}>
          <div className="route-search__directions">
            <div className="route-search__left-icons" aria-hidden="true">
              <span className="route-search__pin route-search__pin--origin" />
              <span className="route-search__pin-separator">⋮</span>
              <span className="route-search__pin route-search__pin--destination" />
            </div>

            <div className="route-search__inputs">
              <div className="route-search__input-group">
                <div className="route-search__input-wrapper">
                  <input
                    ref={originInputRef}
                    id="origin-input"
                    type="text"
                    className={`route-search__input ${errors.origin ? 'route-search__input--error' : ''}`}
                    placeholder={originMode === 'current-location' ? 'Locația mea curentă' : 'Alege punctul de pornire'}
                    value={origin}
                    onChange={(e) => handleInputChange(e.target.value, 'origin')}
                    onFocus={() => {
                      setFocusedField('origin');
                      setShowSuggestions(originMode !== 'current-location');
                    }}
                    onKeyDown={(e) => handleKeyDown(e, 'origin')}
                    autoComplete="off"
                  />
                  {origin ? (
                    <button
                      type="button"
                      className="route-search__clear-btn"
                      onClick={() => handleClear('origin')}
                      aria-label="Șterge originea"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="route-search__search-btn"
                      onClick={() => triggerSearch()}
                      aria-label="Caută rută"
                    >
                      🔍
                    </button>
                  )}
                </div>
                <div className="route-search__input-extra">
                  <button
                    type="button"
                    className={`route-search__location-btn ${originMode === 'current-location' ? 'route-search__location-btn--active' : ''}`}
                    onClick={handleUseCurrentLocation}
                    disabled={locationStatus === 'loading'}
                  >
                    {locationStatus === 'loading'
                      ? 'Se citește locația...'
                      : originMode === 'current-location'
                        ? 'Locația mea activă'
                        : 'Folosește locația mea'}
                  </button>
                  {locationMessage && (
                    <span className={`route-search__location-hint ${locationStatus === 'error' ? 'route-search__location-hint--error' : ''}`}>
                      {locationMessage}
                    </span>
                  )}
                </div>
                {errors.origin && <div className="route-search__error">{errors.origin}</div>}
              </div>

              <div className="route-search__input-group">
                <div className="route-search__input-wrapper">
                  <input
                    ref={destInputRef}
                    id="dest-input"
                    type="text"
                    className={`route-search__input ${errors.destination ? 'route-search__input--error' : ''}`}
                    placeholder="Alege destinația"
                    value={destination}
                    onChange={(e) => handleInputChange(e.target.value, 'destination')}
                    onFocus={() => {
                      setFocusedField('destination');
                      setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, 'destination')}
                    autoComplete="off"
                  />
                  {destination ? (
                    <button
                      type="button"
                      className="route-search__clear-btn"
                      onClick={() => handleClear('destination')}
                      aria-label="Șterge destinația"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="route-search__search-btn"
                      onClick={() => triggerSearch()}
                      aria-label="Caută rută"
                    >
                      🔍
                    </button>
                  )}
                </div>
                {errors.destination && <div className="route-search__error">{errors.destination}</div>}
              </div>
            </div>

            <button
              type="button"
              className="route-search__swap-btn"
              onClick={handleSwap}
              disabled={originMode === 'current-location'}
              aria-label="Inversează ruta"
            >
              ⇅
            </button>
          </div>

          <div className="route-search__divider" />

          <div className="route-search__footer-row">
            <div className="route-search__departure" ref={departureRef}>
              <span className="route-search__departure-icon">🕒</span>
              <button
                type="button"
                className="route-search__departure-btn"
                onClick={() => setShowDepartureMenu((prev) => !prev)}
                aria-expanded={showDepartureMenu}
              >
                {departureOption} <span>▾</span>
              </button>

              {showDepartureMenu && (
                <div className="route-search__departure-menu">
                  {['Pleacă acum', 'Ajungi la'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="route-search__departure-menu-item"
                      onClick={() => {
                        setDepartureOption(option);
                        setShowDepartureMenu(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="route-search__actions">
              {(origin || destination) && (
                <button type="button" className="route-search__ghost-btn" onClick={clearAll}>
                  Resetează
                </button>
              )}
              <button type="submit" className="route-search__primary-btn">
                Afișează ruta
              </button>
            </div>
          </div>
        </form>
      </div>

      {showSuggestions && (
        <div className="route-search__suggestions" ref={suggestionsRef}>
          {loadingSuggestions && <div className="route-search__suggestion-empty">Se caută locații...</div>}

          {!loadingSuggestions && displaySuggestions.length === 0 && (
            <div className="route-search__suggestion-empty">Nu am găsit sugestii.</div>
          )}

          {!loadingSuggestions &&
            displaySuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                className={`route-search__suggestion-item ${index === activeSuggestionIndex ? 'route-search__suggestion-item--highlighted' : ''}`}
                onClick={() => {
                  if (focusedField === 'origin' || !focusedField) {
                    handleSuggestionClick(suggestion, 'origin');
                    return;
                  }
                  handleSuggestionClick(suggestion, 'destination', Boolean(origin));
                }}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                <span className="route-search__suggestion-icon">📍</span>
                <span className="route-search__suggestion-main">
                  <span className="route-search__suggestion-name">{suggestion.name}</span>
                  <span className="route-search__suggestion-detail">
                    {suggestion.displayName || [suggestion.county, suggestion.country].filter(Boolean).join(', ')}
                  </span>
                </span>
              </button>
            ))}

          {!loadingSuggestions && recentSearches.length > 0 && (
            <div className="route-search__recent-inline">
              <div className="route-search__recent-title">Căutări recente</div>
              {recentSearches.slice(0, 3).map((search) => (
                <button
                  key={search.timestamp}
                  className="route-search__recent-item"
                  type="button"
                  onClick={() => {
                    setOrigin(search.origin);
                    setDestination(search.destination);
                    triggerSearch(search.origin, search.destination);
                  }}
                >
                  {search.origin} → {search.destination}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {popularRoutes.length > 0 && (
        <div className="route-search__popular">
          {popularRoutes.slice(0, 4).map((route) => (
            <button
              key={route.id}
              type="button"
              className="route-search__popular-item"
              onClick={() => {
                setOrigin(route.origin);
                setDestination(route.destination);
                triggerSearch(route.origin, route.destination);
              }}
            >
              {route.origin} → {route.destination}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RouteSearch;
