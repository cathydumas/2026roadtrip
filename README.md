# 2026 Road Trip

A trip planner for an 11-day drive from Victoria through the BC Interior and the Canadian Rockies. June 14 to 24, 2026. 2,436 km.

Paper itineraries go stale. Trails close, weather turns, and ferry times matter. This app puts the plan, the map, and live conditions on one phone screen.

Live demo: <add your Vercel URL here>

## What it does

- Day-by-day itinerary with drive distance, stops, and times for all 11 days.
- A map for each day. Real road routes come from OSRM.
- Four map layers you can toggle: Accommodations, Booked Activities, Road Stops, and Groceries.
- An Explore panel with 40+ activities grouped by area. Add one to a day and the map and extra drive distance update.
- Live trail conditions from Parks Canada and Alberta Parks. Activities get flagged as caution or hazardous.
- A Maligne Lake fishing check. It reads the canoe route status and the cruise status.
- Weather from the Open-Meteo GEM model, with glacier temperature adjustments.
- Countdown chips for key bookings.
- Packing checklist and planned activities saved in the browser.
- Navigation links for Google Maps or Apple Maps. You pick one.
- Photo carousels for stays and stops.

## Tech

- React 18 and Vite 5
- Leaflet with Carto map tiles
- Vercel serverless functions in Node for scraping trail and lake conditions
- OSRM for routing and Open-Meteo for weather
- localStorage for state. No database and no accounts.

## How it was built

Claude wrote all of this code in Claude Code. I directed the product through prompts and checked the results the same way. I did not write or edit any of it by hand.

## Run it

```bash
npm install
npm run dev
```

The Vite dev server does not run the `/api` functions. Use `vercel dev` if you need live trail and lake data locally.

Other commands:

```bash
npm run build      # production build to dist/
npm run preview    # serve the build
node test-links.mjs   # check every URL in the data files
```

## Project layout

```
src/App.jsx              UI, map, weather, state
src/data/tripData.js     Days, stops, and map layers
src/data/activities.js   Explore panel activities
api/trail-conditions.js  Parks Canada and Alberta Parks scraper
api/maligne-lake.js      Canoe route and cruise status
api/debug-cache-bust.js  Returns a script that clears cached data
public/images/           Photos
vercel.json              Route rewrites and function timeout
```

## Deploy

The app deploys to Vercel. `vercel.json` rewrites every route to `index.html` and caps API functions at 10 seconds.

## Notes

- The data fits one trip. Edit `tripData.js` and `activities.js` to plan your own.
- Condition data comes from scraping public pages. The parsing breaks if those pages change. Check Parks Canada before you hike.
- Photos come from their original sources and belong to their owners.

Personal project. Not affiliated with Salesforce.
