// Vercel Serverless Function - scrapes Parks Canada trail conditions
// and matches them to our activity IDs.
//
// Usage: GET /api/trail-conditions?park=banff  (or jasper)
// Returns: { park, trails: [ { id, name, condition, severity, comment } ], url, lastUpdated }

// Mapping: Parks Canada trail name fragments → our activity IDs
// Each key is a lowercase substring to match against the trail name on the page.
// Value is an array of activity IDs that should inherit that trail's condition.
const TRAIL_MAP = {
  banff: {
    'lake agnes': ['ll-agnes-tea-house', 'banff-agnes-morning'],
    'johnston canyon': ['banff-johnston-canyon'],
    'plain of six glaciers': ['ll-six-glaciers'],
    'sulphur mountain': ['banff-gondola'],
    'rockpile': ['ll-rockpile'],
    'consolation lake': ['ll-lakeshore-consolation'],
    'lake louise lakeshore': ['ll-lakeshore-walk', 'banff-lakeshore-morning'],
    'moraine lake': ['ll-rockpile', 'll-lakeshore-consolation'],
    'grassi lake': ['banff-grassi-lakes'],
    'ha ling': ['banff-ha-ling'],
    'ink pots': ['banff-johnston-canyon'],
  },
  jasper: {
    'valley of the five lakes': ['jasper-valley-five-lakes'],
    'valley of five lakes': ['jasper-valley-five-lakes'],
    'old fort point': ['jasper-old-fort-point'],
    'sulphur skyline': ['jasper-sulphur-skyline'],
  }
};

// Classify condition + comment into a severity level
// Checks both fields since avalanche warnings are sometimes in the comment only
function classifySeverity(condition, comment) {
  const text = ((condition || '') + ' ' + (comment || '')).toLowerCase();
  if (text.includes('closed') || text.includes('no access')) return 'closed';
  if (text.includes('hazardous') || text.includes('not recommended') || text.includes('avalanche')) return 'hazardous';
  if (text.includes('poor') || text.includes('variable') || text.includes('wet') || text.includes('winter condition') || text.includes('snow covered') || text.includes('icy')) return 'caution';
  if (text.includes('good') || text.includes('mainly dry') || text.includes('fair')) return 'good';
  return 'unknown';
}

export default async function handler(req, res) {
  const { park } = req.query;

  if (!park || !['jasper', 'banff'].includes(park)) {
    return res.status(400).json({ error: 'Invalid park. Must be jasper or banff' });
  }

  const urls = {
    jasper: 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions',
    banff: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonnee-hiking/etat-sentiers-trail-conditions',
  };

  try {
    const response = await fetch(urls[park], {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VacationPlanner/1.0)' }
    });

    if (!response.ok) {
      throw new Error(`Parks Canada returned ${response.status}`);
    }

    const html = await response.text();

    // Parse table rows: each row has cells for Rating, Trail, Condition, Comment, Links
    // We want the Trail (cell 2) and Condition (cell 3) from each row.
    // The HTML structure is: <tr><td>rating</td><td>trail name</td><td>condition</td><td>comment</td>...</tr>
    const results = [];
    const trailMapping = TRAIL_MAP[park] || {};

    // Match all table rows and extract trail name + condition
    // The tables use <td> elements. We look for rows with at least 3 cells.
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];

      // Extract all <td> or <th> cell contents
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        // Strip HTML tags from cell content
        const text = cellMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cells.push(text);
      }

      // Need at least 3 cells: rating, trail name, condition
      if (cells.length < 3) continue;

      const trailName = cells[1];
      const condition = cells[2];
      const comment = cells.length > 3 ? cells[3] : '';

      // Skip header rows or empty trails
      if (!trailName || trailName.toLowerCase() === 'trail' || trailName.length < 3) continue;

      // Check if this trail name matches any of our mapped activities
      const trailLower = trailName.toLowerCase();
      for (const [fragment, activityIds] of Object.entries(trailMapping)) {
        if (trailLower.includes(fragment)) {
          const severity = classifySeverity(condition, comment);
          activityIds.forEach(actId => {
            // Only add if not already found (first match wins for each activity)
            if (!results.find(r => r.id === actId)) {
              results.push({
                id: actId,
                trailName: trailName,
                condition: condition,
                severity: severity,
                comment: comment.slice(0, 200), // Trim long comments
              });
            }
          });
        }
      }
    }

    // Cache for 6 hours
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');

    return res.status(200).json({
      park,
      trails: results,
      url: urls[park],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching trail conditions:', error);
    return res.status(500).json({
      error: 'Failed to fetch trail conditions',
      park,
      trails: [],
      url: urls[park],
      lastUpdated: new Date().toISOString()
    });
  }
}
