// Vercel Serverless Function - scrapes Parks Canada AND Alberta Parks trail conditions
// and matches them to our activity IDs.
//
// Usage: GET /api/trail-conditions?park=banff  (or jasper)
// Returns: { park, trails: [ { id, name, condition, severity, comment } ], url, lastUpdated }

// Mapping: Parks Canada trail name fragments → our activity IDs
const TRAIL_MAP_PARKS_CANADA = {
  banff: {
    'lake agnes': ['ll-agnes-tea-house', 'banff-agnes-morning'],
    'johnston canyon': ['banff-johnston-canyon'],
    'plain of six glaciers': ['ll-six-glaciers'],
    'sulphur mountain': ['banff-gondola'],
    'rockpile': ['ll-rockpile'],
    'consolation lake': ['ll-lakeshore-consolation'],
    'lake louise lakeshore': ['ll-lakeshore-walk', 'banff-lakeshore-morning'],
    'moraine lake': ['ll-rockpile', 'll-lakeshore-consolation'],
    'ink pots': ['banff-johnston-canyon'],
  },
  jasper: {
    'valley of the five lakes': ['jasper-valley-five-lakes'],
    'valley of five lakes': ['jasper-valley-five-lakes'],
    'old fort point': ['jasper-old-fort-point'],
    'sulphur skyline': ['jasper-sulphur-skyline'],
    'wilcox pass': ['jasper-wilcox-pass'],
    'maligne lake canoe route': ['maligne-lake-status'],
    'maligne lake boat launch': ['maligne-lake-status'],
  },
  yoho: {
    'emerald lake': ['banff-emerald-lake'],
    'emerald triangle': ['banff-emerald-lake'],
  }
};

// Mapping: Alberta Parks trail name fragments → our activity IDs
const TRAIL_MAP_ALBERTA_PARKS = {
  'grassi lakes': ['banff-grassi-lakes'],
  'ha ling': ['banff-ha-ling'],
  'rawson lake': ['banff-kananaskis-rawson'],
};

// Classify condition + comment into a severity level
// Checks both fields since avalanche warnings are sometimes in the comment only
function classifySeverity(condition, comment) {
  const text = ((condition || '') + ' ' + (comment || '')).toLowerCase();
  if (text.includes('closed') || text.includes('no access')) return 'closed';
  if (text.includes('hazardous') || text.includes('not recommended') || text.includes('avalanche')) return 'hazardous';
  if (text.includes('warning') || text.includes('poor') || text.includes('variable') || text.includes('wet') || text.includes('winter condition') || text.includes('snow covered') || text.includes('icy') || text.includes('muddy')) return 'caution';
  if (text.includes('open') || text.includes('good') || text.includes('mainly dry') || text.includes('fair')) return 'good';
  return 'unknown';
}

// Classify Alberta Parks status field (simpler: Open, Warning, Closed)
function classifyAlbertaParksStatus(status, notes) {
  const statusLower = (status || '').toLowerCase();
  const notesLower = (notes || '').toLowerCase();

  if (statusLower === 'closed') return 'closed';
  if (statusLower === 'warning' || notesLower.includes('avalanche') || notesLower.includes('hazardous')) return 'caution';
  if (statusLower === 'open') {
    // Check notes for concerning keywords even if status is "open"
    if (notesLower.includes('snow') || notesLower.includes('ice') || notesLower.includes('muddy')) return 'caution';
    return 'good';
  }
  return 'unknown';
}

async function scrapeParksCanada(park) {
  const urls = {
    jasper: 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions',
    banff: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonnee-hiking/etat-sentiers-trail-conditions',
    yoho: 'https://parks.canada.ca/pn-np/bc/yoho/activ/randonnee-hike/etat-sentiers-trail-conditions',
  };

  const results = [];
  const trailMapping = TRAIL_MAP_PARKS_CANADA[park] || {};

  try {
    const response = await fetch(urls[park], {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VacationPlanner/1.0)' }
    });

    if (!response.ok) return results;

    const html = await response.text();
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        const text = cellMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cells.push(text);
      }

      if (cells.length < 3) continue;

      const trailName = cells[1];
      const condition = cells[2];
      const comment = cells.length > 3 ? cells[3] : '';

      if (!trailName || trailName.toLowerCase() === 'trail' || trailName.length < 3) continue;

      const trailLower = trailName.toLowerCase();
      for (const [fragment, activityIds] of Object.entries(trailMapping)) {
        if (trailLower.includes(fragment)) {
          const severity = classifySeverity(condition, comment);
          activityIds.forEach(actId => {
            if (!results.find(r => r.id === actId)) {
              results.push({
                id: actId,
                trailName: trailName,
                condition: condition,
                severity: severity,
                comment: comment.slice(0, 200),
                source: 'Parks Canada'
              });
            }
          });
        }
      }
    }
  } catch (error) {
    // Silently fail - Parks Canada unavailable
  }

  return results;
}

async function scrapeAlbertaParks() {
  const url = 'https://www.albertaparks.ca/parks/kananaskis/kananaskis-country/advisories-and-public-safety/trail-reports/canmore-and-area/';
  const results = [];

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VacationPlanner/1.0)' }
    });

    if (!response.ok) return results;

    const html = await response.text();

    // Alberta Parks uses a table with columns: Trail, Activities, Length, Status, Keywords
    // We need Trail name (column 1) and Status (column 4)
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        const text = cellMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cells.push(text);
      }

      if (cells.length < 4) continue;

      const trailName = cells[0];  // First column is trail name
      const status = cells[3];      // Fourth column is status
      const notes = cells.length > 4 ? cells[4] : '';  // Fifth column is keywords/notes

      if (!trailName || trailName.length < 3) continue;

      const trailLower = trailName.toLowerCase();
      for (const [fragment, activityIds] of Object.entries(TRAIL_MAP_ALBERTA_PARKS)) {
        if (trailLower.includes(fragment)) {
          const severity = classifyAlbertaParksStatus(status, notes);
          activityIds.forEach(actId => {
            if (!results.find(r => r.id === actId)) {
              results.push({
                id: actId,
                trailName: trailName,
                condition: status,
                severity: severity,
                comment: notes.slice(0, 200),
                source: 'Alberta Parks'
              });
            }
          });
        }
      }
    }
  } catch (error) {
    // Silently fail - Alberta Parks unavailable
  }

  return results;
}

export default async function handler(req, res) {
  const { park } = req.query;

  if (!park || !['jasper', 'banff'].includes(park)) {
    return res.status(400).json({ error: 'Invalid park. Must be jasper or banff' });
  }

  try {
    // Fetch from all relevant sources in parallel
    const fetchPromises = [scrapeParksCanada(park)];

    if (park === 'banff') {
      // For Banff area, also check Alberta Parks (Canmore trails) and Yoho (Emerald Lake)
      fetchPromises.push(scrapeAlbertaParks());
      fetchPromises.push(scrapeParksCanada('yoho'));
    }

    const allResults = await Promise.all(fetchPromises);

    // Merge all results, avoiding duplicates
    const results = [];
    allResults.forEach(sourceResults => {
      sourceResults.forEach(trail => {
        if (!results.find(r => r.id === trail.id)) {
          results.push(trail);
        }
      });
    });

    // Cache for 6 hours
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');

    const urls = {
      jasper: 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions',
      banff: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonnee-hiking/etat-sentiers-trail-conditions',
    };

    const sources = ['Parks Canada'];
    if (park === 'banff') {
      sources.push('Alberta Parks', 'Parks Canada Yoho');
    }

    return res.status(200).json({
      park,
      trails: results,
      url: urls[park],
      sources: sources,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching trail conditions:', error);
    const urls = {
      jasper: 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions',
      banff: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonnee-hiking/etat-sentiers-trail-conditions',
    };
    return res.status(500).json({
      error: 'Failed to fetch trail conditions',
      park,
      trails: [],
      url: urls[park],
      lastUpdated: new Date().toISOString()
    });
  }
}
