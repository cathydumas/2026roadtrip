import { useState, useEffect } from 'react';
import { TRIP_DATA, LAYER_NAMES, ITEM_TYPES, HIKE_DIFFICULTIES } from './data/tripData';
import './App.css';

export default function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [mapProvider, setMapProvider] = useState('apple');
  const [activeLayers, setActiveLayers] = useState([1, 2, 3, 4]); // All layers on by default
  const [activeTypes, setActiveTypes] = useState(Object.keys(ITEM_TYPES));
  const [hikeDifficulty, setHikeDifficulty] = useState(2); // 0=easy, 1=moderate, 2=hard (show all)
  const [weather, setWeather] = useState({});
  const [trailConditions, setTrailConditions] = useState({});

  // Fetch weather on mount
  useEffect(() => {
    TRIP_DATA.days.forEach(async (day) => {
      const firstWithCoords = day.items.find(item => item.lat && item.lng);
      if (firstWithCoords) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/gem?latitude=${firstWithCoords.lat}&longitude=${firstWithCoords.lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=7`
          );
          const data = await response.json();
          setWeather(prev => ({ ...prev, [day.id]: data.daily }));
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

  const toggleType = (type) => {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filterItems = (items) => {
    return items.filter(item => {
      // Layer filter
      if (!activeLayers.includes(item.layer)) return false;

      // Type filter
      if (!activeTypes.includes(item.type)) return false;

      // Hike difficulty filter (only applies to hikes)
      if (item.type === 'hike' && item.difficulty) {
        const difficultyLevels = ['easy', 'moderate', 'hard'];
        const itemDifficultyIndex = difficultyLevels.indexOf(item.difficulty);
        if (itemDifficultyIndex > hikeDifficulty) return false;
      }

      return true;
    });
  };

  const getMapUrl = (lat, lng, label) => {
    if (mapProvider === 'apple') {
      return `http://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`;
    } else {
      return `https://maps.google.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`;
    }
  };

  const formatTemp = (temp) => Math.round(temp) + '°';

  const getWeatherEmoji = (code) => {
    if (code <= 3) return '☀️';
    if (code <= 49) return '☁️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '🌨️';
    return '⛈️';
  };

  const getLayerColor = (layer) => {
    const colors = {
      1: '#FF3B30', // Red - must stops
      2: '#FF9500', // Orange - reserved
      3: '#FFCC00', // Yellow - utilities
      4: '#34C759'  // Green - optional
    };
    return colors[layer] || '#8E8E93';
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header glass">
        <div className="header-content">
          <div className="header-dates">{TRIP_DATA.dates}</div>
          <h1 className="header-title">{TRIP_DATA.title}</h1>
          <div className="header-subtitle">{TRIP_DATA.totalKm.toLocaleString()} km total</div>
        </div>

        {/* Map provider toggle */}
        <div className="controls">
          <button
            className={`control-btn ${mapProvider === 'apple' ? 'active' : ''}`}
            onClick={() => setMapProvider(mapProvider === 'apple' ? 'google' : 'apple')}
          >
            {mapProvider === 'apple' ? '🍎' : '🗺️'} {mapProvider === 'apple' ? 'Apple' : 'Google'} Maps
          </button>
        </div>

        {/* Layer filters */}
        <div className="filter-section">
          <div className="filter-label">Map Layers</div>
          <div className="filter-chips">
            {[1, 2, 3, 4].map(layer => (
              <button
                key={layer}
                className={`filter-chip ${activeLayers.includes(layer) ? 'active' : ''}`}
                onClick={() => toggleLayer(layer)}
                style={{
                  '--chip-color': getLayerColor(layer)
                }}
              >
                {LAYER_NAMES[layer]}
              </button>
            ))}
          </div>
        </div>

        {/* Type filters */}
        <div className="filter-section">
          <div className="filter-label">Activity Types</div>
          <div className="filter-chips">
            {Object.entries(ITEM_TYPES).map(([type, { icon, label }]) => (
              <button
                key={type}
                className={`filter-chip ${activeTypes.includes(type) ? 'active' : ''}`}
                onClick={() => toggleType(type)}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Hike difficulty slider */}
        <div className="filter-section">
          <div className="filter-label">
            Hike Difficulty: {hikeDifficulty === 0 ? 'Easy only' : hikeDifficulty === 1 ? 'Up to Moderate' : 'All'}
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
            <span>Hard</span>
          </div>
        </div>
      </header>

      {/* Days list */}
      <div className="days-container">
        {TRIP_DATA.days.map(day => {
          const filteredItems = filterItems(day.items);

          return (
            <div key={day.id} className="day-card card">
              <div
                className="day-header"
                onClick={() => setSelectedDay(selectedDay === day.id ? null : day.id)}
              >
                <div className="day-emoji">{day.emoji}</div>
                <div className="day-info">
                  <div className="day-date">{day.date}</div>
                  <div className="day-title">{day.title}</div>
                  <div className="day-subtitle">
                    {filteredItems.length} of {day.items.length} stops shown
                  </div>
                </div>
                <div className="day-chevron">{selectedDay === day.id ? '◀' : '▶'}</div>
              </div>

              {selectedDay === day.id && (
                <div className="day-content">
                  {/* Weather */}
                  {weather[day.id] && (
                    <div className="weather-widget">
                      <div className="weather-title">Weather</div>
                      <div className="weather-days">
                        {weather[day.id].time.slice(0, 5).map((date, i) => (
                          <div key={date} className="weather-day">
                            <div className="weather-day-name">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="weather-emoji">
                              {getWeatherEmoji(weather[day.id].weathercode[i])}
                            </div>
                            <div className="weather-high">
                              {formatTemp(weather[day.id].temperature_2m_max[i])}
                            </div>
                            <div className="weather-low">
                              {formatTemp(weather[day.id].temperature_2m_min[i])}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="weather-source">Canadian GEM Model via Open-Meteo</div>
                    </div>
                  )}

                  {/* Trail conditions */}
                  {day.park && trailConditions[day.park] && (
                    <a
                      href={trailConditions[day.park].url}
                      target="_blank"
                      rel="noreferrer"
                      className="trail-widget"
                    >
                      <div className="trail-header">
                        <div>
                          <div className="trail-title">
                            🥾 {day.park.charAt(0).toUpperCase() + day.park.slice(1)} Trail Conditions
                          </div>
                          <div className="trail-status">{trailConditions[day.park].status}</div>
                          <div className="trail-summary">{trailConditions[day.park].summary}</div>
                        </div>
                        <div className="trail-arrow">→</div>
                      </div>
                    </a>
                  )}

                  {/* Items */}
                  <div className="items-list">
                    {filteredItems.map((item, idx) => (
                      <div key={idx} className="item-card" style={{ '--layer-color': getLayerColor(item.layer) }}>
                        <div className="item-icon">{ITEM_TYPES[item.type]?.icon || '⭐'}</div>
                        <div className="item-content">
                          {item.time && <div className="item-time">{item.time}</div>}
                          <div className="item-title">{item.title}</div>
                          {item.note && <div className="item-note">{item.note}</div>}
                          {item.difficulty && (
                            <div className="item-difficulty">
                              🥾 {HIKE_DIFFICULTIES[item.difficulty]}
                            </div>
                          )}
                          {item.lat && item.lng && (
                            <a
                              href={getMapUrl(item.lat, item.lng, item.title)}
                              target="_blank"
                              rel="noreferrer"
                              className="item-map-btn"
                            >
                              📍 Open in {mapProvider === 'apple' ? 'Apple' : 'Google'} Maps
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="no-items">
                      No items match your current filters
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer className="footer">
        <p>Tap any day to expand</p>
        <p>Use filters above to customize your view</p>
      </footer>
    </div>
  );
}
