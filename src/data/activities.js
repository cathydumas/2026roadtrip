// Optional activities - curated by area
// Max ~8 per area. Focused on: hikes, gondolas, skiing, active adventures
// No guided tours, no horseback riding, no closed trails

export const ACTIVITIES = [
  // === JASPER (Days 3-4) ===
  {
    id: "jasper-skytram",
    area: "jasper",
    name: "Jasper SkyTram",
    description: "Ride to 2,285m summit station. Boardwalk at top with 360-degree views. Optional hike to true summit (+45 min, moderate).",
    cost: "$65/person",
    duration: "2-3 hours",
    distance: "10 min drive",
    difficulty: "easy",
    lat: 52.8507,
    lng: -118.1231,
    tags: ["views", "gondola"]
  },
  {
    id: "jasper-sulphur-skyline",
    area: "jasper",
    name: "Sulphur Skyline",
    description: "Best views in Jasper. 8km, 700m gain to a ridgeline with views in every direction. Can combine with Miette Hot Springs after.",
    cost: "Free (park pass)",
    duration: "3-4 hours",
    distance: "60 min drive (Miette Rd)",
    difficulty: "hard",
    lat: 53.1253,
    lng: -117.7587,
    tags: ["hike", "summit", "views"]
  },
  {
    id: "jasper-valley-five-lakes",
    area: "jasper",
    name: "Valley of Five Lakes",
    description: "4.5km loop through stunning turquoise lakes. Easy, flat, gorgeous. One of the best short hikes in Jasper.",
    cost: "Free (park pass)",
    duration: "1.5-2 hours",
    distance: "10 min drive south",
    difficulty: "easy",
    lat: 52.8393,
    lng: -118.0325,
    tags: ["hike", "lakes"]
  },
  {
    id: "jasper-old-fort-point",
    area: "jasper",
    name: "Old Fort Point Loop",
    description: "3.7km loop, 60m gain. Iconic views of Jasper townsite, Lac Beauvert, and surrounding mountains. Quick morning hit.",
    cost: "Free (park pass)",
    duration: "1 hour",
    distance: "5 min from town",
    difficulty: "easy",
    lat: 52.8734,
    lng: -118.0591,
    tags: ["hike", "quick"]
  },
  {
    id: "jasper-patricia-lake-paddle",
    area: "jasper",
    name: "Patricia Lake Canoe/Kayak",
    description: "Paddle on Patricia Lake - right next to your cabin. Calm water, mountain reflections. Sunken WWII ship on the bottom (Project Habbakuk).",
    cost: "$60-80/hour rental",
    duration: "1-2 hours",
    distance: "2 min from cabin",
    difficulty: "easy",
    lat: 52.9025,
    lng: -118.0978,
    tags: ["water", "close"]
  },
  {
    id: "jasper-miette-hot-springs",
    area: "jasper",
    name: "Miette Hot Springs",
    description: "Hottest mineral springs in the Canadian Rockies (40C). Outdoor pool surrounded by mountains. Perfect after a hike.",
    cost: "$9/person",
    duration: "1-2 hours",
    distance: "60 min drive",
    difficulty: null,
    lat: 53.1303,
    lng: -117.7698,
    tags: ["relax", "hot springs"]
  },
  {
    id: "jasper-edith-cavell",
    area: "jasper",
    name: "Mt Edith Cavell Meadows",
    description: "Alpine meadows beneath Angel Glacier. Wildflowers in June. Short but steep trail to jaw-dropping glacier views. Road may have limited hours.",
    cost: "Free (park pass)",
    duration: "2-3 hours",
    distance: "30 min drive",
    difficulty: "moderate",
    lat: 52.6833,
    lng: -118.0567,
    tags: ["hike", "glacier", "views"]
  },
  {
    id: "jasper-athabasca-falls",
    area: "jasper",
    name: "Athabasca Falls",
    description: "Most powerful waterfall in the Rockies. Short paved walk from parking, multiple viewpoints. On the way to Icefields Parkway.",
    cost: "Free (park pass)",
    duration: "30 min",
    distance: "30 min drive south",
    difficulty: "easy",
    lat: 52.6644,
    lng: -117.8838,
    tags: ["waterfall", "quick"]
  },

  // === LAKE LOUISE (Days 5-6) ===
  {
    id: "ll-lakeshore-walk",
    area: "lakelouise",
    name: "Lake Louise Lakeshore Walk",
    description: "Flat walk along the turquoise lake to the far end. Best light early morning, fewer crowds. The classic Lake Louise experience.",
    cost: "Free",
    duration: "1-1.5 hours",
    distance: "5 min from lodge",
    difficulty: "easy",
    lat: 51.4117,
    lng: -116.2337,
    tags: ["hike", "iconic", "easy"]
  },
  {
    id: "ll-agnes-tea-house",
    area: "lakelouise",
    name: "Lake Agnes Tea House",
    description: "10.5km return, 400m gain. Historic tea house from 1901 at alpine lake. Cash only ($5-15). Mirror Lake at halfway. Add Big Beehive for panoramic views (+1.5 hrs).",
    cost: "$5-15 for tea (cash only)",
    duration: "3-4 hours",
    distance: "Starts at Chateau",
    difficulty: "moderate",
    lat: 51.4167,
    lng: -116.1767,
    tags: ["hike", "tea house", "iconic"]
  },
  {
    id: "ll-six-glaciers",
    area: "lakelouise",
    name: "Plain of Six Glaciers Tea House",
    description: "14km return along Lake Louise to a second tea house surrounded by glaciers. More remote, more dramatic than Agnes. Cash only.",
    cost: "$5-15 for tea (cash only)",
    duration: "5-6 hours",
    distance: "Starts at Chateau",
    difficulty: "hard",
    lat: 51.3936,
    lng: -116.2728,
    tags: ["hike", "glacier", "tea house"]
  },
  {
    id: "ll-rockpile",
    area: "lakelouise",
    name: "Moraine Lake Rockpile Trail",
    description: "20-min scramble up the rockpile for THE Valley of Ten Peaks viewpoint (old $20 bill). Do this first when you arrive.",
    cost: "Free (shuttle required)",
    duration: "20-30 min",
    distance: "At Moraine Lake",
    difficulty: "easy",
    lat: 51.3282,
    lng: -116.1795,
    tags: ["hike", "quick", "iconic"]
  },
  {
    id: "ll-lakeshore-consolation",
    area: "lakelouise",
    name: "Moraine Lake Lakeshore + Consolation Lakes",
    description: "Lakeshore: 3km flat along the turquoise water. OR Consolation Lakes: 6km return through forest to a quiet alpine lake. Both gorgeous.",
    cost: "Free (shuttle required)",
    duration: "1.5-3 hours",
    distance: "At Moraine Lake",
    difficulty: "easy",
    lat: 51.3264,
    lng: -116.1835,
    tags: ["hike", "lakes", "quiet"]
  },
  {
    id: "ll-canoe",
    area: "lakelouise",
    name: "Canoe on Lake Louise",
    description: "Paddle on the iconic turquoise water beneath Victoria Glacier. Rental at Fairmont Boathouse. Go early to avoid the line.",
    cost: "$160/hour (fits 3)",
    duration: "1 hour",
    distance: "At the lake",
    difficulty: "easy",
    lat: 51.4167,
    lng: -116.2167,
    tags: ["water", "iconic"]
  },
  {
    id: "ll-sunwapta-falls",
    area: "lakelouise",
    name: "Sunwapta Falls",
    description: "Dramatic canyon waterfall on the Icefields Parkway. Easy 600m walk from parking. Beautiful stop between Jasper and Lake Louise.",
    cost: "Free (park pass)",
    duration: "20-30 min",
    distance: "On Icefields Parkway",
    difficulty: "easy",
    lat: 52.5327,
    lng: -117.6438,
    tags: ["waterfall", "quick"]
  },
  {
    id: "ll-peyto-lake",
    area: "lakelouise",
    name: "Peyto Lake (Bow Summit)",
    description: "Wolf-shaped turquoise lake viewed from Bow Summit lookout. 10-min walk to viewpoint. One of the most photographed spots in the Rockies.",
    cost: "Free (park pass)",
    duration: "30 min",
    distance: "40 min drive north",
    difficulty: "easy",
    lat: 51.7171,
    lng: -116.5076,
    tags: ["views", "quick", "iconic"]
  },

  // === BANFF / CANMORE (Days 7-9) ===
  {
    id: "banff-johnston-canyon",
    area: "banff",
    name: "Johnston Canyon + Ink Pots",
    description: "Most recommended r/Banff hike. Steel catwalks through canyon to waterfalls, then vivid turquoise mineral springs. Leave by 8 AM.",
    cost: "Free (park pass)",
    duration: "5-6 hours (full to Ink Pots)",
    distance: "30 min drive",
    difficulty: "moderate",
    lat: 51.2455,
    lng: -115.8399,
    tags: ["hike", "waterfall", "iconic"]
  },
  {
    id: "banff-grassi-lakes",
    area: "banff",
    name: "Grassi Lakes",
    description: "Crystal-clear turquoise lakes with ancient Cree pictographs on cliff face. Two routes: easy gravel or moderate with waterfall views. 2 hrs return.",
    cost: "Free",
    duration: "2 hours",
    distance: "5 min from Canmore",
    difficulty: "moderate",
    lat: 51.0783,
    lng: -115.4031,
    tags: ["hike", "close", "lakes"]
  },
  {
    id: "banff-ha-ling",
    area: "banff",
    name: "Ha Ling Peak",
    description: "Most iconic summit hike from Canmore. 5.4km, 745m gain. Ridgeline views over the entire Bow Valley. Start by 7 AM.",
    cost: "Free",
    duration: "4-5 hours",
    distance: "5 min from Canmore",
    difficulty: "hard",
    lat: 51.0614,
    lng: -115.4180,
    tags: ["hike", "summit", "close"]
  },
  {
    id: "banff-sunshine-ski",
    area: "banff",
    name: "Summer Skiing - Sunshine Village",
    description: "Rare summer ski season Jun 20 - Jul 5, 2026. One lift, several runs after record snowfall. Unique once-in-a-lifetime experience.",
    cost: "$70-90/person",
    duration: "Half day",
    distance: "35 min drive",
    difficulty: "moderate",
    lat: 51.1182,
    lng: -115.7632,
    tags: ["skiing", "unique"]
  },
  {
    id: "banff-gondola",
    area: "banff",
    name: "Banff Gondola - Sulphur Mountain",
    description: "8-min ride to 2,281m. Boardwalk to Sanson Peak, interpretive centre, 360-degree views of six mountain ranges. Restaurant at summit.",
    cost: "$76/person",
    duration: "2-3 hours",
    distance: "20 min from Canmore",
    difficulty: "easy",
    lat: 51.1479,
    lng: -115.5555,
    tags: ["gondola", "views"]
  },
  {
    id: "banff-via-ferrata",
    area: "banff",
    name: "Via Ferrata - Mt Norquay",
    description: "Guided climbing on iron rungs and cables up cliff faces. No experience needed. Multiple routes from beginner (2.5 hrs) to advanced.",
    cost: "$179-249/person",
    duration: "3-4 hours",
    distance: "25 min drive",
    difficulty: "moderate",
    lat: 51.2038,
    lng: -115.6015,
    tags: ["adventure", "climbing"]
  },
  {
    id: "banff-kananaskis-rawson",
    area: "banff",
    name: "Rawson Lake (Kananaskis)",
    description: "Turquoise alpine lake beneath dramatic headwall. 7.4km, 335m gain. 4.9 stars, rarely crowded. Quieter than anything in Banff.",
    cost: "Free (K-Country pass $15)",
    duration: "3-4 hours",
    distance: "45 min south",
    difficulty: "moderate",
    lat: 50.6100,
    lng: -115.1187,
    tags: ["hike", "lakes", "quiet"]
  },
  {
    id: "banff-hot-springs",
    area: "banff",
    name: "Banff Upper Hot Springs",
    description: "Historic outdoor mineral pool at 1,585m with Rundle Mountain views. Open from 10 AM. Perfect post-hike reward.",
    cost: "$11/person",
    duration: "1-2 hours",
    distance: "20 min from Canmore",
    difficulty: null,
    lat: 51.1508,
    lng: -115.5610,
    tags: ["relax", "hot springs"]
  }
];

export const AREA_NAMES = {
  jasper: "Jasper",
  lakelouise: "Lake Louise",
  banff: "Banff / Canmore"
};

// Which days correspond to which activity area
export const DAY_AREAS = {
  3: "jasper",
  4: "jasper",
  5: "lakelouise",
  6: "lakelouise",
  7: "banff",
  8: "banff",
  9: "banff"
};
