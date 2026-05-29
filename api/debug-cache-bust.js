// Debug endpoint: returns JavaScript to clear all localStorage caches
// Visit: /api/debug-cache-bust
// Then paste the returned code into console

export default function handler(req, res) {
  const clearScript = `
// Clear all vacation planner localStorage caches
const keys = [
  'rr_maligne_lake',
  'rr_maligne_lake_v2',
  'rr_trail_conditions',
  'rr_weather',
  'rr_planned'
];

keys.forEach(key => {
  if (localStorage.getItem(key)) {
    console.log('Cleared:', key);
    localStorage.removeItem(key);
  } else {
    console.log('Not found:', key);
  }
});

console.log('All caches cleared. Reloading...');
location.reload();
`.trim();

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(clearScript);
}
