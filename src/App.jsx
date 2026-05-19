import { useState, useEffect, useRef } from 'react';
import { TRIP_DATA, LAYER_NAMES, ITEM_TYPES, HIKE_DIFFICULTIES } from './data/tripData';
import './App.css';

// Determine which day is "today" - Day 1 before trip starts
function getTodayId() {
  const now = new Date();
  const tripDates = [
    new Date('2026-06-14'), new Date('2026-06-15'), new Date('2026-06-16'),
    new Date('2026-06-17'), new Date('2026-06-18'), new Date('2026-06-19'),
    new Date('2026-06-20'), new Date('2026-06-21'), new Date('2026-06-22'),
    new Date('2026-06-23'), new Date('2026-06-24')
  ];

  for (let i = 0; i < tripDates.length; i++) {
    const d = tripDates[i];
    if (now.getFullYear() === d.getFullYear() &&
        now.getMonth() === d.getMonth() &&
        now.getDate() === d.getDate()) {
      return i + 1;
    }
  }

  // Before trip or after trip - show Day 1
  if (now < tripDates[0]) return 1;
  return 11;
}

// Leaflet map component for each day
function DayMap({ day, items, getMapUrl }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    if (!L) return;

    const coords = items.filter(i => i.lat && i.lng).map(i => [i.lat, i.lng]);
    if (coords.length === 0) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true,
    });

    // Use a clean, modern tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add markers with layer colors
    const layerColors = {
      1: '#FF3B30',
      2: '#FF9500',
      3: '#8E8E93',
      4: '#34C759'
    };

    items.filter(i => i.lat && i.lng).forEach((item, idx) => {
      const color = layerColors[item.layer] || '#007AFF';
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:-apple-system,system-ui,sans-serif;font-size:14px;min-width:140px">
          <div style="font-weight:700;margin-bottom:4px">${item.title.replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊]/g, '').trim()}</div>
          ${item.time ? `<div style="color:#86868b;font-size:12px;margin-bottom:6px">${item.time}</div>` : ''}
          <a href="${getMapUrl(item.lat, item.lng, item.title)}" target="_blank" rel="noreferrer" style="display:inline-block;padding:6px 12px;background:#007AFF;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">Navigate</a>
        </div>
      `);
    });

    // Draw route line
    if (coords.length > 1) {
      L.polyline(coords, {
        color: day.color || '#007AFF',
        weight: 3,
        opacity: 0.6,
        dashArray: '8, 8',
      }).addTo(map);
    }

    // Fit bounds
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [30, 30] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [items]);

  const hasCoords = items.some(i => i.lat && i.lng);
  if (!hasCoords) return null;

  return (
    <div className="day-map" ref={mapRef} />
  );
}

export default function App() {
  const [expandedDay, setExpandedDay] = useState(getTodayId());
  const [mapProvider, setMapProvider] = useState(() => {
    return localStorage.getItem('rr_map_provider') || 'google';
  });
  const [activeLayers, setActiveLayers] = useState([1, 2, 3, 4]);
  const [hikeDifficulty, setHikeDifficulty] = useState(2);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [weather, setWeather] = useState({});
  const [trailConditions, setTrailConditions] = useState({});
  const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);

  // Load Leaflet from CDN
  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Save map provider preference
  useEffect(() => {
    localStorage.setItem('rr_map_provider', mapProvider);
  }, [mapProvider]);

  // Fetch weather
  useEffect(() => {
    TRIP_DATA.days.forEach(async (day) => {
      const firstWithCoords = day.items.find(item => item.lat && item.lng);
      if (firstWithCoords) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/gem?latitude=${firstWithCoords.lat}&longitude=${firstWithCoords.lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America/Vancouver&start_date=2026-06-14&end_date=2026-06-24`
          );
          const data = await response.json();
          if (data.daily) {
            setWeather(prev => ({ ...prev, [day.id]: data.daily }));
          }
        } catch (error) {
          console.error('Weather fetch error:', error);
        }
      }

      if (day.park) {
        try {
          const response = await fetch(`/api/trail-conditions?park=${day.park}`);
          const data = await response.json();
          setTrailConditions(prev => ({ ...prev, [day.park]: data }));
        } catch (error) {
          console.error('Trail conditions fetch error:', error);
        }
      }
    });
  }, []);

  const toggleLayer = (layer) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const filterItems = (items) => {
    return items.filter(item => {
      if (!activeLayers.includes(item.layer)) return false;
      if (item.type === 'hike' && item.difficulty) {
        const levels = ['easy', 'moderate', 'hard'];
        if (levels.indexOf(item.difficulty) > hikeDifficulty) return false;
      }
      return true;
    });
  };

  const getMapUrl = (lat, lng, label) => {
    const cleanLabel = label.replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊]/g, '').trim();
    if (mapProvider === 'apple') {
      return `http://maps.apple.com/?q=${encodeURIComponent(cleanLabel)}&ll=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
  };

  const getWeatherEmoji = (code) => {
    if (code <= 3) return '☀️';
    if (code <= 49) return '☁️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '🌨️';
    return '⛈️';
  };

  const getLayerColor = (layer) => {
    const colors = { 1: '#FF3B30', 2: '#FF9500', 3: '#8E8E93', 4: '#34C759' };
    return colors[layer] || '#8E8E93';
  };

  const getLayerEmoji = (layer) => {
    const emojis = { 1: '🏨', 2: '🎫', 3: '⛽', 4: '✨' };
    return emojis[layer] || '📍';
  };

  const activeLayerCount = activeLayers.length;

  return (
    <div className="app">
      {/* Minimal header */}
      <header className="header glass">
        <div className="header-left">
          <h1 className="header-title">Rockies 2026</h1>
          <div className="header-meta">{TRIP_DATA.dates} · {TRIP_DATA.totalKm.toLocaleString()} km</div>
        </div>
        <button
          className="prefs-btn"
          onClick={() => setPrefsOpen(!prefsOpen)}
          aria-label="Preferences"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          {activeLayerCount < 4 && <span className="prefs-badge">{activeLayerCount}</span>}
        </button>
      </header>

      {/* Day cards */}
      <div className="days-container">
        {TRIP_DATA.days.map(day => {
          const isExpanded = expandedDay === day.id;
          const filteredItems = filterItems(day.items);
          const isToday = getTodayId() === day.id;

          return (
            <div key={day.id} className={`day-card ${isExpanded ? 'expanded' : ''} ${isToday ? 'today' : ''}`}>
              <button
                className="day-header"
                onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                aria-expanded={isExpanded}
              >
                <div className="day-badge" style={{ background: day.color }}>
                  <span className="day-num">{day.id}</span>
                </div>
                <div className="day-info">
                  <div className="day-top-row">
                    <span className="day-date">{day.date}</span>
                    {isToday && <span className="today-pill">Today</span>}
                  </div>
                  <div className="day-title">{day.title}</div>
                </div>
                <div className={`day-chevron ${isExpanded ? 'open' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="day-content">
                  <div className="day-subtitle">{day.emoji} {day.subtitle}</div>

                  {/* Embedded map */}
                  {leafletLoaded && (
                    <DayMap
                      day={day}
                      items={filteredItems}
                      getMapUrl={getMapUrl}
                    />
                  )}

                  {/* Weather strip */}
                  {weather[day.id] && (
                    <div className="weather-strip">
                      {weather[day.id].time && weather[day.id].time.slice(0, 3).map((date, i) => (
                        <div key={date} className="weather-chip">
                          <span className="weather-emoji">{getWeatherEmoji(weather[day.id].weathercode[i])}</span>
                          <span className="weather-temp">{Math.round(weather[day.id].temperature_2m_max[i])}°</span>
                        </div>
                      ))}
                      <span className="weather-label">GEM forecast</span>
                    </div>
                  )}

                  {/* Trail conditions link */}
                  {day.park && trailConditions[day.park] && (
                    <a
                      href={trailConditions[day.park].url}
                      target="_blank"
                      rel="noreferrer"
                      className="trail-link"
                    >
                      <span>🥾 {day.park.charAt(0).toUpperCase() + day.park.slice(1)} trails: {trailConditions[day.park].status}</span>
                      <span className="trail-arrow">→</span>
                    </a>
                  )}

                  {/* Items list */}
                  <div className="items-list">
                    {filteredItems.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-dot" style={{ background: getLayerColor(item.layer) }} />
                        <div className="item-body">
                          <div className="item-header-row">
                            <span className="item-title">{item.title}</span>
                            {item.time && <span className="item-time">{item.time}</span>}
                          </div>
                          {item.note && <div className="item-note">{item.note}</div>}
                          {item.difficulty && (
                            <span className={`difficulty-tag ${item.difficulty}`}>
                              {HIKE_DIFFICULTIES[item.difficulty]}
                            </span>
                          )}
                          {item.lat && item.lng && (
                            <a
                              href={getMapUrl(item.lat, item.lng, item.title)}
                              target="_blank"
                              rel="noreferrer"
                              className="nav-btn"
                            >
                              Navigate →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredItems.length === 0 && (
                      <div className="no-items">
                        No stops match your filters. Tap <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign:'middle'}}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> to adjust.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom sheet preferences */}
      {prefsOpen && <div className="prefs-backdrop" onClick={() => setPrefsOpen(false)} />}
      <div className={`prefs-sheet ${prefsOpen ? 'open' : ''}`}>
        <div className="prefs-handle" onClick={() => setPrefsOpen(false)} />

        <div className="prefs-section">
          <div className="prefs-label">Navigation app</div>
          <div className="segmented-control">
            <button
              className={`seg-btn ${mapProvider === 'google' ? 'active' : ''}`}
              onClick={() => setMapProvider('google')}
            >
              Google Maps
            </button>
            <button
              className={`seg-btn ${mapProvider === 'apple' ? 'active' : ''}`}
              onClick={() => setMapProvider('apple')}
            >
              Apple Maps
            </button>
          </div>
        </div>

        <div className="prefs-section">
          <div className="prefs-label">Show layers</div>
          <div className="layer-toggles">
            {[1, 2, 3, 4].map(layer => (
              <button
                key={layer}
                className={`layer-toggle ${activeLayers.includes(layer) ? 'active' : ''}`}
                onClick={() => toggleLayer(layer)}
                style={{ '--layer-color': getLayerColor(layer) }}
              >
                <span className="layer-emoji">{getLayerEmoji(layer)}</span>
                <span className="layer-name">{LAYER_NAMES[layer]}</span>
                <span className={`layer-check ${activeLayers.includes(layer) ? 'on' : ''}`}>
                  {activeLayers.includes(layer) ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="prefs-section">
          <div className="prefs-label">
            Hike difficulty: {hikeDifficulty === 0 ? 'Easy only' : hikeDifficulty === 1 ? 'Up to Moderate' : 'All levels'}
          </div>
          <input
            type="range"
            min="0"
            max="2"
            value={hikeDifficulty}
            onChange={(e) => setHikeDifficulty(parseInt(e.target.value))}
            className="difficulty-slider"
          />
          <div className="slider-labels">
            <span>Easy</span>
            <span>Moderate</span>
            <span>Strenuous</span>
          </div>
        </div>

        <button className="prefs-done" onClick={() => setPrefsOpen(false)}>Done</button>
      </div>
    </div>
  );
}
