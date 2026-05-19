// Vercel Serverless Function to scrape Parks Canada trail conditions
export default async function handler(req, res) {
  const { park } = req.query;

  if (!park || !['jasper', 'banff', 'yoho'].includes(park)) {
    return res.status(400).json({ error: 'Invalid park. Must be jasper, banff, or yoho' });
  }

  const urls = {
    jasper: 'https://parks.canada.ca/pn-np/ab/jasper/activ/experience/sentiers-trails/etat-sentiers-trail-conditions',
    banff: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonnee-hiking/etat-sentiers-trail-conditions',
    yoho: 'https://parks.canada.ca/pn-np/bc/yoho/activ/randonnee-hike/etat-sentiers-trail-conditions'
  };

  try {
    const response = await fetch(urls[park]);
    const html = await response.text();

    // Parse the overall summary status from the page
    // Parks Canada typically has a summary section at the top
    let status = 'Unknown';
    let summary = '';

    // Look for common status indicators
    if (html.includes('Good') || html.includes('good condition')) {
      status = 'Good';
      summary = 'Most trails are in good condition';
    } else if (html.includes('Mainly Dry') || html.includes('mainly dry')) {
      status = 'Mainly Dry';
      summary = 'Trails are mostly dry and accessible';
    } else if (html.includes('Closed') || html.includes('closures')) {
      status = 'Caution';
      summary = 'Some trail closures in effect';
    } else if (html.includes('Poor') || html.includes('poor condition')) {
      status = 'Poor';
      summary = 'Trails may be hazardous';
    }

    // Try to extract trail list
    const trails = [];
    const trailRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<td[^>]*>(.*?)<\/td>/gi;
    let match;
    let count = 0;

    while ((match = trailRegex.exec(html)) !== null && count < 20) {
      const trailName = match[1].replace(/<[^>]*>/g, '').trim();
      const trailStatus = match[2].replace(/<[^>]*>/g, '').trim();

      if (trailName && trailStatus && trailName.length > 2) {
        trails.push({
          name: trailName,
          status: trailStatus
        });
        count++;
      }
    }

    // Calculate overall status from trail data
    if (trails.length > 0) {
      const openCount = trails.filter(t =>
        t.status.toLowerCase().includes('open') ||
        t.status.toLowerCase().includes('good')
      ).length;
      const closedCount = trails.filter(t =>
        t.status.toLowerCase().includes('closed')
      ).length;
      const cautionCount = trails.filter(t =>
        t.status.toLowerCase().includes('caution') ||
        t.status.toLowerCase().includes('hazard')
      ).length;

      if (closedCount > trails.length / 3) {
        status = 'Closed';
        summary = `${closedCount} trails closed`;
      } else if (cautionCount > trails.length / 3) {
        status = 'Caution';
        summary = `${cautionCount} trails require caution`;
      } else if (openCount > trails.length / 2) {
        status = 'Good';
        summary = `${openCount}/${trails.length} trails open`;
      } else {
        status = 'Mixed';
        summary = `${openCount} open, ${closedCount} closed`;
      }
    }

    // Cache for 6 hours
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');

    return res.status(200).json({
      park,
      status,
      summary,
      trails: trails.slice(0, 10), // Return top 10 trails
      url: urls[park],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching trail conditions:', error);
    return res.status(500).json({
      error: 'Failed to fetch trail conditions',
      park,
      status: 'Unknown',
      summary: 'Unable to fetch data',
      url: urls[park]
    });
  }
}
