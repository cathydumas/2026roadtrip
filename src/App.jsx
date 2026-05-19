import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TRIP_DATA, LAYER_NAMES, ITEM_TYPES } from './data/tripData';
import { ACTIVITIES, AREA_NAMES, DAY_AREAS, PARK_TRAIL_URLS } from './data/activities';
import './App.css';

// Rough km estimate between two lat/lng points (Haversine)
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Estimate extra km from planned activity points (round trip from accommodation)
function estimateExtraKm(startAccom, plannedPoints) {
  if (!plannedPoints || plannedPoints.length === 0 || !startAccom) return 0;
  // Calculate round-trip from accommodation to farthest planned point
  // Use 1.4x multiplier to account for road vs straight-line distance
  let maxDist = 0;
  plannedPoints.forEach(p => {
    const dist = haversineKm(startAccom.lat, startAccom.lng, p.lat, p.lng);
    if (dist > maxDist) maxDist = dist;
  });
  return Math.round(maxDist * 2 * 1.4);
}

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
  if (now < tripDates[0]) return 1;
  return 11;
}

// Generate .ics calendar event
function generateICS(item, dayDate) {
  const cleanTitle = item.title.replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊🚌]/g, '').trim();
  // Parse a rough time from item.time
  const dateStr = dayDate.replace(/^[A-Za-z]+ /, ''); // "Jun 14" etc
  const year = 2026;
  const monthDay = dateStr.trim();
  const dateObj = new Date(`${monthDay}, ${year}`);
  const ymd = dateObj.toISOString().split('T')[0].replace(/-/g, '');

  let startTime = '090000';
  let endTime = '100000';

  if (item.time) {
    const timeMatch = item.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1]);
      const m = timeMatch[2];
      const ampm = timeMatch[3];
      if (ampm && ampm.toUpperCase() === 'PM' && h < 12) h += 12;
      if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
      startTime = `${String(h).padStart(2, '0')}${m}00`;
      const endH = h + 1;
      endTime = `${String(endH).padStart(2, '0')}${m}00`;
    }
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rockies2026//EN',
    'BEGIN:VEVENT',
    `DTSTART:${ymd}T${startTime}`,
    `DTEND:${ymd}T${endTime}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${(item.note || '').replace(/\n/g, '\\n')}`,
    item.lat ? `GEO:${item.lat};${item.lng}` : '',
    item.lat ? `LOCATION:${item.lat}\\, ${item.lng}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanTitle.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// Route cache to avoid refetching
const routeCache = {};

// Fetch OSRM route between waypoints - with retry and caching
async function fetchRoute(coords, dayId) {
  if (coords.length < 2) return null;

  const cacheKey = coords.map(c => `${c[0].toFixed(3)},${c[1].toFixed(3)}`).join('|');
  if (routeCache[cacheKey]) return routeCache[cacheKey];

  // Limit to 25 waypoints max (OSRM limit)
  const limited = coords.length > 25
    ? coords.filter((_, i) => i === 0 || i === coords.length - 1 || i % Math.ceil(coords.length / 23) === 0)
    : coords;

  const waypoints = limited.map(c => `${c[1]},${c[0]}`).join(';');
  try {
    const resp = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.routes && data.routes[0]) {
      const result = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      routeCache[cacheKey] = result;
      return result;
    }
  } catch (e) {
    // Silently fail - map will show without route line
  }
  return null;
}

// Leaflet map component for each day - uses a stable fingerprint to avoid re-renders
function DayMap({ day, itemsKey, items, plannedPoints, mapProvider }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const builtKeyRef = useRef(null);

  useEffect(() => {
    // Only rebuild if the item fingerprint actually changed
    if (builtKeyRef.current === itemsKey && mapInstanceRef.current) return;
    if (!mapRef.current) return;

    // Clean up previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    if (!L) return;

    // Build all points for the map: start accommodation + items + end accommodation
    const allPoints = [];

    // Add start accommodation if this day has one (where you're leaving from)
    if (day.startAccom && day.startAccom.lat) {
      allPoints.push({
        lat: day.startAccom.lat,
        lng: day.startAccom.lng,
        title: day.startAccom.title,
        isAccom: true,
        layer: 1
      });
    }

    // Add all items with coordinates
    items.filter(i => i.lat && i.lng).forEach(item => {
      allPoints.push(item);
    });

    // Add planned activity points
    if (plannedPoints && plannedPoints.length > 0) {
      plannedPoints.forEach(p => allPoints.push(p));
    }

    if (allPoints.length === 0) return;

    const coords = allPoints.map(p => [p.lat, p.lng]);

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true,
    });

    // Clean map tiles
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    L.tileLayer(
      prefersDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(map);

    const layerColors = { 1: '#FF3B30', 2: '#FF9500', 3: '#8E8E93', planned: '#007AFF' };

    const getMapUrl = (lat, lng, label) => {
      const cleanLabel = (label || '').replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊🚌]/g, '').trim();
      if (mapProvider === 'apple') {
        return `http://maps.apple.com/?q=${encodeURIComponent(cleanLabel)}&ll=${lat},${lng}`;
      }
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    };

    allPoints.forEach((item) => {
      const color = layerColors[item.layer] || '#007AFF';
      const radius = item.layer === 1 ? 9 : 7; // Hotels are bigger dots
      const marker = L.circleMarker([item.lat, item.lng], {
        radius,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      const cleanTitle = (item.title || '').replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊🚌]/g, '').trim();
      marker.bindPopup(`
        <div style="font-family:-apple-system,system-ui,sans-serif;font-size:14px;min-width:140px">
          <div style="font-weight:700;margin-bottom:4px">${cleanTitle}</div>
          ${item.isAccom ? '<div style="color:#FF3B30;font-size:12px;margin-bottom:6px">Start</div>' : ''}
          ${item.time ? `<div style="color:#86868b;font-size:12px;margin-bottom:6px">${item.time}</div>` : ''}
          <a href="${getMapUrl(item.lat, item.lng, item.title || '')}" target="_blank" rel="noreferrer" style="display:inline-block;padding:6px 12px;background:#007AFF;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">Navigate</a>
        </div>
      `);
    });

    // Fetch real road route (only if 2+ distinct points)
    const uniqueCoords = coords.filter((c, i) =>
      i === 0 || Math.abs(c[0] - coords[i-1][0]) > 0.001 || Math.abs(c[1] - coords[i-1][1]) > 0.001
    );

    if (uniqueCoords.length >= 2) {
      fetchRoute(uniqueCoords, day.id).then(routeCoords => {
        if (!mapInstanceRef.current) return;
        if (routeCoords && routeCoords.length > 1) {
          L.polyline(routeCoords, {
            color: day.color || '#007AFF',
            weight: 3,
            opacity: 0.7,
          }).addTo(map);
        } else {
          // Fallback: dashed straight lines
          L.polyline(uniqueCoords, {
            color: day.color || '#007AFF',
            weight: 3,
            opacity: 0.5,
            dashArray: '8, 8',
          }).addTo(map);
        }
      });
    }

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [30, 30] });

    mapInstanceRef.current = map;
    builtKeyRef.current = itemsKey;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      builtKeyRef.current = null;
    };
  }, [itemsKey]); // Only re-run when the fingerprint changes

  // Show map if we have items with coords OR a start accommodation
  const hasCoords = items.some(i => i.lat && i.lng) || (day.startAccom && day.startAccom.lat);
  if (!hasCoords) return null;

  return <div className="day-map" ref={mapRef} />;
}

// Explore panel for optional activities
function ExplorePanel({ area, dayId, dayDate, onClose, mapProvider, plannedIds, onAddActivity, onRemoveActivity, activityConditions }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [diffFilter, setDiffFilter] = useState('all');
  const activities = ACTIVITIES.filter(a => a.area === area);

  const allTags = [...new Set(activities.flatMap(a => a.tags || []))];

  const filtered = activities.filter(a => {
    if (selectedTags.length > 0 && !(a.tags && a.tags.some(t => selectedTags.includes(t)))) return false;
    if (diffFilter !== 'all' && a.difficulty && a.difficulty !== diffFilter) {
      const levels = ['easy', 'moderate', 'hard'];
      if (levels.indexOf(a.difficulty) > levels.indexOf(diffFilter)) return false;
    }
    return true;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const getNavUrl = (lat, lng, name) => {
    if (mapProvider === 'apple') {
      return `http://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  };

  // Check if we have any conditions data for activities in this area
  const hasConditionsData = activities.some(a => activityConditions[a.id]);
  const conditionsTimestamp = (() => {
    try {
      const cached = localStorage.getItem('rr_trail_conditions');
      if (cached) {
        const { fetchedAt } = JSON.parse(cached);
        const hrs = Math.round((Date.now() - fetchedAt) / (1000 * 60 * 60));
        if (hrs < 1) return 'updated just now';
        if (hrs === 1) return 'updated 1 hr ago';
        return `updated ${hrs} hrs ago`;
      }
    } catch {}
    return null;
  })();

  return (
    <div className="explore-panel">
      <div className="explore-header">
        <div>
          <div className="explore-title">Explore {AREA_NAMES[area]}</div>
          <div className="explore-subtitle">{filtered.length} activities</div>
        </div>
        <button className="explore-close" onClick={onClose}>Done</button>
      </div>

      {hasConditionsData && conditionsTimestamp && (
        <div className="conditions-freshness">
          Trail conditions from Parks Canada, {conditionsTimestamp}
        </div>
      )}

      {/* Difficulty filter */}
      <div className="explore-diff-row">
        {['all', 'easy', 'moderate', 'hard'].map(d => (
          <button
            key={d}
            className={`explore-diff-btn ${diffFilter === d ? 'active' : ''}`}
            onClick={() => setDiffFilter(d)}
          >
            {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div className="explore-tags">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`explore-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="explore-list">
        {filtered.map(activity => {
          const isAdded = plannedIds.includes(activity.id);
          const cond = activityConditions[activity.id];
          const isHazardous = cond && (cond.severity === 'hazardous' || cond.severity === 'closed');
          const isCaution = cond && cond.severity === 'caution';
          return (
            <div key={activity.id} className={`explore-card ${isAdded ? 'added' : ''} ${isHazardous ? 'hazardous' : ''} ${isCaution ? 'caution' : ''}`}>
              {isHazardous && (
                <div className="conditions-warning">
                  ⚠️ {cond.condition}{cond.comment ? ` - ${cond.comment}` : ''}
                </div>
              )}
              {isCaution && (
                <div className="conditions-caution">
                  ⚡ {cond.condition}{cond.comment ? ` - ${cond.comment}` : ''}
                </div>
              )}
              <div className="explore-card-header">
                <div className="explore-card-name">{activity.name}</div>
                {activity.difficulty && (
                  <span className={`difficulty-tag ${activity.difficulty}`}>
                    {activity.difficulty}
                  </span>
                )}
              </div>
              <div className="explore-card-desc">{activity.description}</div>
              <div className="explore-card-meta">
                <span>{activity.cost}</span>
                <span>{activity.duration}</span>
                <span>{activity.distance}</span>
              </div>
              {(activity.alltrails || activity.park) && (
                <div className="explore-card-links">
                  {activity.alltrails && (
                    <a href={activity.alltrails} target="_blank" rel="noreferrer" className="explore-link alltrails">
                      AllTrails
                    </a>
                  )}
                  {activity.park && PARK_TRAIL_URLS[activity.park] && (
                    <a href={PARK_TRAIL_URLS[activity.park]} target="_blank" rel="noreferrer" className="explore-link conditions">
                      Trail conditions
                    </a>
                  )}
                </div>
              )}
              <div className="explore-card-actions">
                {isAdded ? (
                  <button
                    className="explore-remove-btn"
                    onClick={() => onRemoveActivity(dayId, activity.id)}
                  >
                    Remove from day
                  </button>
                ) : (
                  <button
                    className="explore-add-btn"
                    onClick={() => onAddActivity(dayId, activity.id)}
                  >
                    + Add to day {dayId}
                  </button>
                )}
                {activity.lat && (
                  <a
                    href={getNavUrl(activity.lat, activity.lng, activity.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="explore-nav-btn"
                  >
                    Navigate
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [expandedDay, setExpandedDay] = useState(getTodayId());
  const [mapProvider, setMapProvider] = useState(() => {
    return localStorage.getItem('rr_map_provider') || 'google';
  });
  const [activeLayers, setActiveLayers] = useState([1, 2, 3]);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [exploreArea, setExploreArea] = useState(null);
  const [weather, setWeather] = useState({});
  // Per-activity conditions from Parks Canada scraper: { activityId: { severity, condition, comment } }
  const [activityConditions, setActivityConditions] = useState(() => {
    try {
      const cached = localStorage.getItem('rr_trail_conditions');
      if (cached) {
        const { data, fetchedAt } = JSON.parse(cached);
        // Use cache if less than 24 hours old
        if (Date.now() - fetchedAt < 24 * 60 * 60 * 1000) return data;
      }
    } catch {}
    return {};
  });
  const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);

  // Planned activities: { dayId: [activityId, ...] } - persisted in localStorage
  const [plannedActivities, setPlannedActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('rr_planned');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Save planned activities
  useEffect(() => {
    localStorage.setItem('rr_planned', JSON.stringify(plannedActivities));
  }, [plannedActivities]);

  const addActivity = (dayId, activityId) => {
    setPlannedActivities(prev => {
      const dayList = prev[dayId] || [];
      if (dayList.includes(activityId)) return prev;
      return { ...prev, [dayId]: [...dayList, activityId] };
    });
  };

  const removeActivity = (dayId, activityId) => {
    setPlannedActivities(prev => {
      const dayList = (prev[dayId] || []).filter(id => id !== activityId);
      return { ...prev, [dayId]: dayList };
    });
  };

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

  // Fetch weather - use forecast_days for near-future, gracefully handle if too far out
  useEffect(() => {
    TRIP_DATA.days.forEach(async (day) => {
      const firstWithCoords = day.items.find(item => item.lat && item.lng);
      if (firstWithCoords) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/gem?latitude=${firstWithCoords.lat}&longitude=${firstWithCoords.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America/Vancouver&forecast_days=16`
          );
          const data = await response.json();
          if (data.daily && data.daily.time) {
            setWeather(prev => ({ ...prev, [day.id]: data.daily }));
          }
        } catch (error) {
          // Weather not available yet (too far in future) - that's ok
        }
      }
    });
  }, []);

  // Fetch trail conditions from Parks Canada scraper
  // Cached in localStorage for 24 hours to avoid hammering the endpoint
  useEffect(() => {
    // Check if we already have fresh cached data
    try {
      const cached = localStorage.getItem('rr_trail_conditions');
      if (cached) {
        const { fetchedAt } = JSON.parse(cached);
        if (Date.now() - fetchedAt < 24 * 60 * 60 * 1000) return; // Still fresh
      }
    } catch {}

    // Fetch both parks in parallel
    async function fetchConditions() {
      const parks = ['banff', 'jasper'];
      const allConditions = {};

      await Promise.all(parks.map(async (park) => {
        try {
          const response = await fetch(`/api/trail-conditions?park=${park}`);
          const data = await response.json();
          if (data && !data.error && data.trails) {
            // Map per-activity conditions
            data.trails.forEach(trail => {
              allConditions[trail.id] = {
                severity: trail.severity,
                condition: trail.condition,
                comment: trail.comment,
                trailName: trail.trailName,
              };
            });
          }
        } catch (error) {
          // Trail conditions unavailable - that's ok
        }
      }));

      if (Object.keys(allConditions).length > 0) {
        setActivityConditions(allConditions);
        localStorage.setItem('rr_trail_conditions', JSON.stringify({
          data: allConditions,
          fetchedAt: Date.now()
        }));
      }
    }

    fetchConditions();
  }, []);

  const toggleLayer = (layer) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const filterItems = useCallback((items) => {
    return items.filter(item => activeLayers.includes(item.layer));
  }, [activeLayers]);

  // Pre-compute filtered items for all days with stable references
  const filteredByDay = useMemo(() => {
    const result = {};
    TRIP_DATA.days.forEach(day => {
      result[day.id] = filterItems(day.items);
    });
    return result;
  }, [filterItems]);

  // Get planned activity points for a day (including compound sub-stops)
  const getPlannedPoints = useCallback((dayId) => {
    const ids = plannedActivities[dayId] || [];
    const points = [];
    ids.forEach(actId => {
      const activity = ACTIVITIES.find(a => a.id === actId);
      if (!activity) return;
      if (activity.compound && activity.stops) {
        activity.stops.forEach(stop => {
          if (stop.lat && stop.lng) {
            points.push({ lat: stop.lat, lng: stop.lng, title: stop.title, note: stop.note, time: stop.time, layer: 'planned' });
          }
        });
      } else if (activity.lat && activity.lng) {
        points.push({ lat: activity.lat, lng: activity.lng, title: activity.name, note: activity.description, time: activity.duration, layer: 'planned' });
      }
    });
    return points;
  }, [plannedActivities]);

  // Stable map fingerprints - includes planned activities
  const mapKeys = useMemo(() => {
    const result = {};
    TRIP_DATA.days.forEach(day => {
      const items = filteredByDay[day.id];
      const plannedPts = getPlannedPoints(day.id);
      const startPart = day.startAccom ? `S:${day.startAccom.lat},${day.startAccom.lng}|` : '';
      const itemsPart = items
        .filter(i => i.lat && i.lng)
        .map(i => `${i.lat},${i.lng}`)
        .join('|');
      const plannedPart = plannedPts.length > 0
        ? '|P:' + plannedPts.map(p => `${p.lat},${p.lng}`).join('|')
        : '';
      result[day.id] = startPart + itemsPart + plannedPart;
    });
    return result;
  }, [filteredByDay, getPlannedPoints]);

  const getMapUrl = useCallback((lat, lng, label) => {
    const cleanLabel = (label || '').replace(/[✅📷🥾⭐♨️🚡🦕🚂☕🍽️🍳🥩🛒⛽🐻🌊🚌]/g, '').trim();
    if (mapProvider === 'apple') {
      return `http://maps.apple.com/?q=${encodeURIComponent(cleanLabel)}&ll=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  }, [mapProvider]);

  const getWeatherEmoji = (code) => {
    if (code === undefined || code === null) return '?';
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
          {activeLayerCount < 3 && <span className="prefs-badge">{activeLayerCount}</span>}
        </button>
      </header>

      {/* Day cards */}
      <div className="days-container">
        {TRIP_DATA.days.map(day => {
          const isExpanded = expandedDay === day.id;
          const filteredItems = filteredByDay[day.id];
          const isToday = getTodayId() === day.id;
          const dayArea = DAY_AREAS[day.id];
          const plannedPts = getPlannedPoints(day.id);
          const extraKm = estimateExtraKm(day.startAccom || day.items.find(i => i.lat && i.lng), plannedPts);
          const totalKm = day.km + extraKm;

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
                    {totalKm > 0 && <span className="day-km">{totalKm} km{extraKm > 0 ? ` (+${extraKm})` : ''}</span>}
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
                      plannedPoints={getPlannedPoints(day.id)}
                      itemsKey={mapKeys[day.id]}
                      mapProvider={mapProvider}
                    />
                  )}

                  {/* Weather strip */}
                  {weather[day.id] && weather[day.id].time && (
                    <div className="weather-strip">
                      {weather[day.id].time.slice(0, 3).map((date, i) => (
                        <div key={date} className="weather-chip">
                          <span className="weather-emoji">
                            {getWeatherEmoji(weather[day.id].weather_code ? weather[day.id].weather_code[i] : weather[day.id].weathercode?.[i])}
                          </span>
                          <span className="weather-temp">{Math.round(weather[day.id].temperature_2m_max[i])}°</span>
                        </div>
                      ))}
                      <span className="weather-label">GEM forecast</span>
                    </div>
                  )}


                  {/* Items list */}
                  <div className="items-list">
                    {filteredItems.map((item, idx) => {
                      const isWarning = item.title.includes('LAST SHUTTLE') || item.time?.includes('⚠️');
                      return (
                        <div key={idx} className={`item-row ${isWarning ? 'item-warning' : ''}`}>
                          <div className="item-dot" style={{ background: getLayerColor(item.layer) }} />
                          <div className="item-body">
                            <div className="item-header-row">
                              <span className="item-title">{item.title}</span>
                              {item.time && <span className="item-time">{item.time}</span>}
                            </div>
                            {item.note && <div className="item-note">{item.note}</div>}
                            <div className="item-actions">
                              {item.lat && item.lng && (
                                <a
                                  href={getMapUrl(item.lat, item.lng, item.title)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="nav-btn"
                                >
                                  Navigate
                                </a>
                              )}
                              <button
                                className="cal-btn"
                                onClick={() => generateICS(item, day.date)}
                                title="Add to Apple Calendar"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredItems.length === 0 && !plannedActivities[day.id]?.length && (
                      <div className="no-items">
                        No stops yet. Tap Explore below to add activities.
                      </div>
                    )}
                  </div>

                  {/* Planned activities from Explore */}
                  {plannedActivities[day.id] && plannedActivities[day.id].length > 0 && (
                    <div className="planned-section">
                      <div className="planned-label">Planned activities</div>
                      {plannedActivities[day.id].map(actId => {
                        const activity = ACTIVITIES.find(a => a.id === actId);
                        if (!activity) return null;
                        const cond = activityConditions[actId];
                        const isHazardous = cond && (cond.severity === 'hazardous' || cond.severity === 'closed');
                        const isCaution = cond && cond.severity === 'caution';
                        return (
                          <div key={actId} className={`planned-card ${isHazardous ? 'hazardous' : ''} ${isCaution ? 'caution' : ''}`}>
                            {isHazardous && (
                              <div className="conditions-warning">⚠️ {cond.condition}{cond.comment ? ` - ${cond.comment}` : ''}</div>
                            )}
                            {isCaution && (
                              <div className="conditions-caution">⚡ {cond.condition}{cond.comment ? ` - ${cond.comment}` : ''}</div>
                            )}
                            <div className="planned-card-top">
                              <div className="planned-card-name">{activity.name}</div>
                              {activity.difficulty && <span className={`difficulty-tag ${activity.difficulty}`}>{activity.difficulty}</span>}
                            </div>
                            <div className="planned-card-meta">
                              <span>{activity.duration}</span>
                              <span>{activity.cost}</span>
                              <span>{activity.distance}</span>
                            </div>
                            {/* Compound activities show their sub-stops as a timeline */}
                            {activity.compound && activity.stops && (
                              <div className="planned-stops">
                                {activity.stops.map((stop, si) => (
                                  <div key={si} className="planned-stop-row">
                                    <div className="planned-stop-title">{stop.title}</div>
                                    <div className="planned-stop-note">{stop.note}</div>
                                    {stop.lat && (
                                      <a
                                        href={getMapUrl(stop.lat, stop.lng, stop.title)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="planned-stop-nav"
                                      >
                                        Navigate
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="planned-card-actions">
                              {activity.lat && !activity.compound && (
                                <a
                                  href={getMapUrl(activity.lat, activity.lng, activity.name)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="nav-btn"
                                >
                                  Navigate
                                </a>
                              )}
                              {activity.alltrails && (
                                <a href={activity.alltrails} target="_blank" rel="noreferrer" className="planned-link">
                                  AllTrails
                                </a>
                              )}
                              <button
                                className="planned-remove-btn"
                                onClick={() => removeActivity(day.id, actId)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explore button for days in activity areas */}
                  {dayArea && (
                    <button
                      className="explore-btn"
                      onClick={() => setExploreArea({ area: dayArea, dayId: day.id, dayDate: day.date })}
                    >
                      <span>✨ Explore {AREA_NAMES[dayArea]} activities</span>
                      <span className="explore-count">
                        {ACTIVITIES.filter(a => a.area === dayArea).length} options
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Explore activities panel */}
      {exploreArea && (
        <>
          <div className="explore-backdrop" onClick={() => setExploreArea(null)} />
          <ExplorePanel
            area={exploreArea.area}
            dayId={exploreArea.dayId}
            dayDate={exploreArea.dayDate}
            onClose={() => setExploreArea(null)}
            mapProvider={mapProvider}
            plannedIds={plannedActivities[exploreArea.dayId] || []}
            onAddActivity={addActivity}
            onRemoveActivity={removeActivity}
            activityConditions={activityConditions}
          />
        </>
      )}

      {/* Bottom sheet preferences */}
      {prefsOpen && (
        <div
          className="prefs-backdrop"
          onClick={() => setPrefsOpen(false)}
          onTouchEnd={(e) => { e.stopPropagation(); setPrefsOpen(false); }}
        />
      )}
      <div
        className={`prefs-sheet ${prefsOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
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
            {[1, 2, 3].map(layer => (
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

        <button className="prefs-done" onClick={() => setPrefsOpen(false)}>Done</button>
      </div>
    </div>
  );
}
