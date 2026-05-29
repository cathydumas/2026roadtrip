// Vercel Serverless Function - checks Maligne Lake status for fishing feasibility
//
// Two signals:
// 1. Parks Canada canoe route condition (Easy route: Boat Launch → Hidden Cove)
// 2. Maligne Lake Cruise operating status (if cruise runs, fishing boat can too)
//
// Usage: GET /api/maligne-lake
// Returns: { canoeRoute: { condition, comment, severity, updatedDate }, cruise: { operating, seasonStart, note }, summary, lastChecked }

export default async function handler(req, res) {
  const result = {
    canoeRoute: null,
    cruise: null,
    summary: '',
    lastChecked: new Date().toISOString()
  };

  // Signal 1: Parks Canada canoe route (the Easy one)
  try {
    const pcUrl = 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions';
    const pcResp = await fetch(pcUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VacationPlanner/1.0)' }
    });

    if (pcResp.ok) {
      const html = await pcResp.text();

      // Find the Maligne Lake Canoe Route: Boat Launch to Hidden Cove (Easy route)
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
        if (!trailName) continue;

        // Match the easy canoe route (Boat Launch to Hidden Cove)
        const trailLower = trailName.toLowerCase();
        if (trailLower.includes('maligne lake') && trailLower.includes('boat launch')) {
          const condition = cells[2] || '';
          const comment = cells.length > 3 ? cells[3] : '';

          // Try to extract date from comment (format: "2026-05-17: ...")
          let updatedDate = null;
          const dateMatch = comment.match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) updatedDate = dateMatch[1];

          // Clean up comment - remove the date prefix if present
          const cleanComment = comment.replace(/^\d{4}-\d{2}-\d{2}:\s*/, '').trim();

          result.canoeRoute = {
            condition,
            comment: cleanComment.slice(0, 300),
            updatedDate,
            trailName
          };
          break;
        }
      }
    }
  } catch (error) {
    // Parks Canada unavailable - continue with cruise check
  }

  // Signal 2: Maligne Lake Cruise operating status
  // 2026 season: May 27 - October 11
  // Simplified: just check if we're in the known operating season
  const now = new Date();
  const year = now.getFullYear();
  const seasonStart = new Date(year, 4, 27); // May 27 (month is 0-indexed)
  const seasonEnd = new Date(year, 9, 11);   // October 11

  if (now >= seasonStart && now <= seasonEnd) {
    result.cruise = {
      operating: true,
      seasonStart: 'May 27',
      note: 'Operating (May 27 - October 11, 2026)'
    };
  } else if (now < seasonStart) {
    const daysUntil = Math.ceil((seasonStart - now) / (1000 * 60 * 60 * 24));
    result.cruise = {
      operating: false,
      seasonStart: 'May 27',
      note: `Season starts May 27 (${daysUntil} days away)`
    };
  } else {
    result.cruise = {
      operating: false,
      seasonStart: 'May 27',
      note: 'Season ended October 11'
    };
  }

  // Build summary
  if (result.canoeRoute && result.cruise) {
    const lakeCondition = result.canoeRoute.condition.toLowerCase();
    const isFrozen = result.canoeRoute.comment.toLowerCase().includes('frozen') ||
      result.canoeRoute.comment.toLowerCase().includes('ice');

    if (isFrozen && !result.cruise.operating) {
      result.summary = 'Lake still frozen. Cruise not yet operating. Fishing unlikely.';
    } else if (isFrozen && result.cruise.operating) {
      result.summary = 'Parks Canada says frozen but cruise is running - conditions may be changing. Confirm with fishing operator.';
    } else if (!isFrozen && result.cruise.operating) {
      result.summary = 'Lake open. Cruise operating. Fishing should be good to go.';
    } else if (!isFrozen && !result.cruise.operating) {
      result.summary = 'Parks Canada says lake is accessible. Cruise not yet running. Check with fishing operator.';
    } else {
      result.summary = `Canoe route: ${result.canoeRoute.condition}. Cruise: ${result.cruise.note}`;
    }
  } else if (result.canoeRoute) {
    result.summary = `Canoe route: ${result.canoeRoute.condition}. ${result.canoeRoute.comment}`;
  } else if (result.cruise) {
    result.summary = `Cruise: ${result.cruise.note}`;
  } else {
    result.summary = 'Unable to check lake status. Contact fishing operator directly.';
  }

  // Cache for 1 hour (reduced since logic is now hardcoded and fast)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  return res.status(200).json(result);
}

// Extract season start date from the cruise page HTML
function extractSeasonStart(html) {
  // Look for patterns like "May 27" or "June 1" near "operating" or schedule tables
  // The page typically has date ranges like "May 27 – June 19"
  // Handle various dash characters: hyphen, en-dash, em-dash
  const patterns = [
    /(?:open|season|operating)[^<]*?((?:May|June|July)\s+\d{1,2})/i,
    /((?:May|June)\s+\d{1,2})\s*[-–—]/i, // hyphen, en-dash, em-dash
    /(May|June)\s+\d{1,2}/i, // Fallback: just find any May/June date
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }

  return null;
}
