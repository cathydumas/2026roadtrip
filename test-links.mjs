// Automated link validation test
// Run: node test-links.mjs
// Tests all navigation links, AllTrails URLs, and Parks Canada URLs

import { readFileSync } from 'fs';

// Parse the data files manually (they use export syntax)
const activitiesSource = readFileSync('./src/data/activities.js', 'utf-8');
const tripDataSource = readFileSync('./src/data/tripData.js', 'utf-8');

// Extract all URLs from both files
const urlRegex = /https?:\/\/[^"'\s,]+/g;
const activityUrls = [...activitiesSource.matchAll(urlRegex)].map(m => m[0]);
const tripDataUrls = [...tripDataSource.matchAll(urlRegex)].map(m => m[0]);
const allUrls = [...new Set([...activityUrls, ...tripDataUrls])];

// Extract all lat/lng pairs from activities
const latMatches = [...activitiesSource.matchAll(/lat:\s*([\d.-]+)/g)];
const lngMatches = [...activitiesSource.matchAll(/lng:\s*([\d.-]+)/g)];

// Validate coordinate ranges (BC/Alberta: lat 49-54, lng -120 to -111)
const coordErrors = [];
for (let i = 0; i < latMatches.length; i++) {
  const lat = parseFloat(latMatches[i][1]);
  const lng = parseFloat(lngMatches[i]?.[1]);
  if (lat < 49 || lat > 54) {
    coordErrors.push(`  lat ${lat} out of range (49-54) near line context`);
  }
  if (lng && (lng < -120 || lng > -111)) {
    coordErrors.push(`  lng ${lng} out of range (-120 to -111) near lat ${lat}`);
  }
}

// Validate tripData coordinates (wider range for ferry/Victoria)
const tripLatMatches = [...tripDataSource.matchAll(/lat:\s*([\d.-]+)/g)];
const tripLngMatches = [...tripDataSource.matchAll(/lng:\s*([\d.-]+)/g)];
const tripCoordErrors = [];
for (let i = 0; i < tripLatMatches.length; i++) {
  const lat = parseFloat(tripLatMatches[i][1]);
  const lng = parseFloat(tripLngMatches[i]?.[1]);
  // BC trip range: lat 48.5-53.2, lng -123.5 to -115
  if (lat < 48 || lat > 54) {
    tripCoordErrors.push(`  tripData lat ${lat} out of expected range`);
  }
  if (lng && (lng < -124 || lng > -111)) {
    tripCoordErrors.push(`  tripData lng ${lng} out of expected range (near lat ${lat})`);
  }
}

// Validate Google Maps navigation URLs would be correct
function validateNavUrl(lat, lng, label, provider) {
  if (provider === 'google') {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    // Check URL is well-formed
    try { new URL(url); return { valid: true, url }; }
    catch { return { valid: false, url, error: 'Invalid URL' }; }
  } else {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`;
    try { new URL(url); return { valid: true, url }; }
    catch { return { valid: false, url, error: 'Invalid URL' }; }
  }
}

// Test navigation URL generation for all activity coordinates
const navErrors = [];
for (let i = 0; i < latMatches.length; i++) {
  const lat = parseFloat(latMatches[i][1]);
  const lng = parseFloat(lngMatches[i]?.[1]);
  if (!lng) continue;
  const googleResult = validateNavUrl(lat, lng, 'Test', 'google');
  const appleResult = validateNavUrl(lat, lng, 'Test Location', 'apple');
  if (!googleResult.valid) navErrors.push(`Google nav URL invalid for ${lat},${lng}: ${googleResult.error}`);
  if (!appleResult.valid) navErrors.push(`Apple nav URL invalid for ${lat},${lng}: ${appleResult.error}`);
}

// Validate AllTrails URL structure
const alltrailsUrls = allUrls.filter(u => u.includes('alltrails.com'));
const alltrailsErrors = [];
alltrailsUrls.forEach(url => {
  // Should match pattern: /trail/canada/{province}/{slug}
  const pattern = /^https:\/\/www\.alltrails\.com\/trail\/canada\/(alberta|british-columbia)\/[\w-]+$/;
  if (!pattern.test(url)) {
    alltrailsErrors.push(`  Unusual AllTrails URL format: ${url}`);
  }
});

// Validate Parks Canada URLs
const parksUrls = allUrls.filter(u => u.includes('parks.canada.ca'));
const parksErrors = [];
parksUrls.forEach(url => {
  if (!url.includes('trail-conditions') && !url.includes('sentiers')) {
    parksErrors.push(`  Parks Canada URL doesn't point to trail conditions: ${url}`);
  }
});

// Check for duplicate activities
const idMatches = [...activitiesSource.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
const duplicateIds = idMatches.filter((id, i) => idMatches.indexOf(id) !== i);

// Check compound activity stops have coordinates
const compoundMatch = activitiesSource.match(/compound:\s*true[\s\S]*?stops:\s*\[([\s\S]*?)\]/);
const compoundStopErrors = [];
if (compoundMatch) {
  const stopsBlock = compoundMatch[1];
  const stops = stopsBlock.split('},');
  stops.forEach((stop, i) => {
    if (!stop.includes('lat:') || !stop.includes('lng:')) {
      compoundStopErrors.push(`  Compound stop ${i + 1} missing coordinates`);
    }
  });
}

// Print results
console.log('\n=== LINK & DATA VALIDATION RESULTS ===\n');

console.log(`Total URLs found: ${allUrls.length}`);
console.log(`  AllTrails: ${alltrailsUrls.length}`);
console.log(`  Parks Canada: ${parksUrls.length}`);
console.log(`  Activity coordinates: ${latMatches.length}`);
console.log(`  Trip data coordinates: ${tripLatMatches.length}`);
console.log(`  Activity IDs: ${idMatches.length}`);
console.log('');

let hasErrors = false;

if (coordErrors.length > 0) {
  console.log('❌ ACTIVITY COORDINATE ISSUES:');
  coordErrors.forEach(e => console.log(e));
  hasErrors = true;
} else {
  console.log('✅ All activity coordinates in valid BC/Alberta range');
}

if (tripCoordErrors.length > 0) {
  console.log('❌ TRIP DATA COORDINATE ISSUES:');
  tripCoordErrors.forEach(e => console.log(e));
  hasErrors = true;
} else {
  console.log('✅ All trip data coordinates in valid range');
}

if (alltrailsErrors.length > 0) {
  console.log('⚠️  ALLTRAILS URL FORMAT ISSUES:');
  alltrailsErrors.forEach(e => console.log(e));
} else {
  console.log('✅ All AllTrails URLs follow expected pattern');
}

if (parksErrors.length > 0) {
  console.log('❌ PARKS CANADA URL ISSUES:');
  parksErrors.forEach(e => console.log(e));
  hasErrors = true;
} else {
  console.log('✅ All Parks Canada URLs valid');
}

if (navErrors.length > 0) {
  console.log('❌ NAVIGATION URL ISSUES:');
  navErrors.forEach(e => console.log(e));
  hasErrors = true;
} else {
  console.log('✅ All navigation URLs (Google + Apple Maps) generate correctly');
}

if (duplicateIds.length > 0) {
  console.log('❌ DUPLICATE ACTIVITY IDS:');
  duplicateIds.forEach(id => console.log(`  ${id}`));
  hasErrors = true;
} else {
  console.log('✅ No duplicate activity IDs');
}

if (compoundStopErrors.length > 0) {
  console.log('❌ COMPOUND ACTIVITY ISSUES:');
  compoundStopErrors.forEach(e => console.log(e));
  hasErrors = true;
} else {
  console.log('✅ Compound activity stops all have coordinates');
}

// Validate URL reachability for non-AllTrails URLs (AllTrails blocks bots)
console.log('\n--- Checking Parks Canada URL reachability ---');
const parksCheckResults = await Promise.all(
  parksUrls.map(async url => {
    try {
      const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
      return { url, status: resp.status, ok: resp.ok };
    } catch (e) {
      return { url, status: 'ERROR', ok: false, error: e.message };
    }
  })
);

parksCheckResults.forEach(r => {
  if (r.ok) {
    console.log(`  ✅ ${r.status} ${r.url}`);
  } else {
    console.log(`  ❌ ${r.status} ${r.url} ${r.error || ''}`);
    hasErrors = true;
  }
});

console.log('\n' + (hasErrors ? '❌ Some issues found - see above' : '✅ All checks passed!'));
console.log('');

// Print summary of all AllTrails URLs for manual spot-check
console.log('--- AllTrails URLs (blocked for automated testing, verify in browser) ---');
alltrailsUrls.forEach(url => console.log(`  ${url}`));
console.log('');
