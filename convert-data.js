// Read TSX and extract just the initialDays array
const fs = require('fs');
const tsx = fs.readFileSync('/Users/USER/Downloads/road-trip-planner.tsx', 'utf8');

// Extract the initialDays array
const start = tsx.indexOf('const initialDays = [');
const end = tsx.indexOf('];', start) + 2;
const daysCode = tsx.substring(start, end);

// Evaluate it
eval(daysCode);

console.log(JSON.stringify(initialDays, null, 2));
