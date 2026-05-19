// Layer definitions:
// 1 = Must-stop (booked hotels)
// 2 = Reserved (confirmed excursions & restaurant reservations)
// 3 = Road utilities (gas, lunch suggestions, waypoints)
// 4 = Optional activities

export const TRIP_DATA = {
  title: "BC Interior & Canadian Rockies",
  dates: "June 14-24, 2026",
  totalKm: 2436,

  days: [
    {
      id: 1,
      date: "Sun Jun 14",
      title: "Victoria → Kelowna",
      subtitle: "Ferry day & wine country arrival",
      color: "#2D6A4F",
      emoji: "🍷",
      park: null,
      items: [
        { layer: 2, type: "ferry", time: "10:00 AM", title: "✅ Swartz Bay Ferry", note: "Queen of New Westminster - check in 30-60 min early", lat: 48.68826, lng: -123.41201 },
        { layer: 3, type: "food", time: "Lunch in Hope", title: "🍽️ Home Restaurant", note: "665 Old Hope Princeton Way · Classic diner, huge portions, famous homemade pie", lat: 49.3758583, lng: -121.4271316 },
        { layer: 4, type: "food", time: "OR lunch", title: "☕ Blue Moose Coffee House", note: "322 Wallace St · Great coffee, fresh sandwiches", lat: 49.3795278, lng: -121.4410722 },
        { layer: 1, type: "hotel", time: "Late afternoon", title: "Comfort Suites Kelowna", note: "2656 BC-97 · check in", lat: 49.8936661, lng: -119.4170556 },
        { layer: 2, type: "wine", time: "7:30 PM", title: "✅ Mission Hill Winery", note: "Dinner reservation 7:30 PM", lat: 49.8351166, lng: -119.5867142 }
      ]
    },
    {
      id: 2,
      date: "Mon Jun 15",
      title: "Kelowna → Jasper",
      subtitle: "Big drive day - Mt Robson stop",
      color: "#1B4332",
      emoji: "🏔️",
      park: null,
      items: [
        { layer: 3, type: "food", time: "Morning", title: "☕ 350° Bakehouse", note: "1892 Spall Rd - open 7:30 AM", lat: 49.8793977, lng: -119.4551504 },
        { layer: 4, type: "market", time: "Morning", title: "🥩 Carnist Butcher", note: "1038 Richter St · Tue-Sat 10-6", lat: 49.8966773, lng: -119.4887348 },
        { layer: 3, type: "drive", time: "En route", title: "⛽ Fill up in Kamloops", note: "Last fuel before mountains", lat: 50.6745, lng: -120.3273 },
        { layer: 3, type: "food", time: "Lunch", title: "☕ Wild Flour Café", note: "Clearwater · Fresh sourdough, homemade baking", lat: 51.6521206, lng: -120.0389419 },
        { layer: 4, type: "hike", time: "Midday", title: "Mt Robson + Kinney Lake", note: "2.5 hrs return through old-growth forest", lat: 53.0310201, lng: -119.25479650000001, difficulty: "easy" },
        { layer: 3, type: "activity", time: "En route", title: "⛽ Fill up in Valemount", note: "Last fuel before Jasper", lat: 52.8321, lng: -119.2626 },
        { layer: 1, type: "hotel", time: "Evening", title: "Patricia Lake Bungalows", note: "Maple Cabin, 3 nights", lat: 52.902511, lng: -118.097846 }
      ]
    },
    {
      id: 3,
      date: "Tue Jun 16",
      title: "Jasper Day 1",
      subtitle: "Maligne Lake + morning hike",
      color: "#1B4332",
      emoji: "🎣",
      park: "jasper",
      items: [
        { layer: 3, type: "activity", time: "Morning", title: "🐻 Buy Bear Spray", note: "Everest Outdoor · ~$50-60 each, get 3", lat: 52.87809120000001, lng: -118.07995149999998 },
        { layer: 4, type: "hike", time: "Morning PICK ONE", title: "🥾 Old Fort Point Loop", note: "3.7km, 60m gain - iconic views", lat: 52.8734, lng: -118.0591, difficulty: "easy" },
        { layer: 4, type: "hike", time: "Morning OR", title: "🥾 Pyramid Lake", note: "Easy/Scenic - flat walk to island", lat: 52.9235246, lng: -118.098878, difficulty: "easy" },
        { layer: 4, type: "hike", time: "Morning OR", title: "🥾 Sulphur Skyline", note: "8km, 700m gain - best views in Jasper", lat: 53.1253, lng: -117.7587, difficulty: "hard" },
        { layer: 4, type: "scenic", time: "Afternoon", title: "📷 Maligne Lake", note: "Drive Maligne Road - Medicine Lake en route", lat: 52.6654279, lng: -117.5345287 },
        { layer: 2, type: "activity", time: "5-9 PM", title: "✅ Maligne Lake Fishing", note: "Jasper Park Fishing · CONFIRMED", lat: 52.6654279, lng: -117.5345287 }
      ]
    },
    {
      id: 4,
      date: "Wed Jun 17",
      title: "Jasper Day 2",
      subtitle: "Miette Hot Springs + adventure",
      color: "#1B4332",
      emoji: "♨️",
      park: "jasper",
      items: [
        { layer: 4, type: "activity", time: "Morning PICK ONE", title: "🚡 Jasper SkyTram", note: "Ride to 2,285m - 360° views", lat: 52.8507461, lng: -118.1231336 },
        { layer: 4, type: "hike", time: "Morning OR", title: "🥾 Valley of Five Lakes", note: "4.5km loop, stunning turquoise lakes", lat: 52.8393327, lng: -118.0325314, difficulty: "easy" },
        { layer: 4, type: "hot_spring", time: "Evening", title: "♨️ Miette Hot Springs", note: "Hottest springs in Canadian Rockies", lat: 53.130305, lng: -117.769765 },
        { layer: 3, type: "drive", time: "On way home", title: "⛽ Fill up in Jasper", note: "Fill tonight - leaving early tomorrow" }
      ]
    },
    {
      id: 5,
      date: "Thu Jun 18",
      title: "Jasper → Lake Louise",
      subtitle: "Icefields Parkway + Columbia Icefield",
      color: "#0A3D62",
      emoji: "❄️",
      park: "banff",
      items: [
        { layer: 4, type: "scenic", time: "~30 min", title: "📷 Athabasca Falls", note: "Most powerful waterfall in Rockies", lat: 52.664437, lng: -117.883767 },
        { layer: 2, type: "glacier", time: "11:30 AM", title: "✅ Columbia Icefield", note: "CONFIRMED · Ice Explorer + Skywalk", lat: 52.2201943, lng: -117.226141 },
        { layer: 3, type: "drive", time: "Mid-afternoon", title: "⛽ Saskatchewan River Crossing", note: "Only gas between Jasper & Lake Louise", lat: 51.9338, lng: -116.8319 },
        { layer: 4, type: "scenic", time: "Afternoon", title: "📷 Peyto Lake", note: "Wolf-shaped lake from Bow Summit", lat: 51.7171414, lng: -116.507574 },
        { layer: 1, type: "hotel", time: "Evening", title: "Paradise Lodge", note: "Saddleback Suite, 2 nights", lat: 51.4161708, lng: -116.196697 }
      ]
    },
    {
      id: 6,
      date: "Fri Jun 19",
      title: "Lake Louise Day",
      subtitle: "Moraine Lake, lakeshore & lunch",
      color: "#0A3D62",
      emoji: "🏔️",
      park: "banff",
      items: [
        { layer: 4, type: "hike", time: "Morning", title: "Lake Louise Lakeshore Walk", note: "Go early - best light, fewer crowds", lat: 51.4116775, lng: -116.233715, difficulty: "easy" },
        { layer: 2, type: "food", time: "12:15 PM", title: "✅ Lakeview Lounge", note: "Chateau Lake Louise · Lunch reservation", lat: 51.4163, lng: -116.2138 },
        { layer: 2, type: "activity", time: "4:00-5:00 PM", title: "✅ Moraine Lake Shuttle", note: "CONFIRMED · 3 adults · Depart Park & Ride", lat: 51.4412008, lng: -116.162196 },
        { layer: 4, type: "hike", time: "At Moraine Lake", title: "Rockpile Trail", note: "20-min hike to Valley of Ten Peaks viewpoint", lat: 51.3282264, lng: -116.179504, difficulty: "easy" }
      ]
    },
    {
      id: 7,
      date: "Sat Jun 20",
      title: "Lake Louise → Banff → Canmore",
      subtitle: "Emerald Lake, Banff townsite & hot springs",
      color: "#6B2D8B",
      emoji: "♨️",
      park: "banff",
      items: [
        { layer: 4, type: "hike", time: "Early morning", title: "Plain of Six Glaciers Trail", note: "14km return, ends at Teahouse. Only if you have the legs!", lat: 51.3935843, lng: -116.272776, difficulty: "hard" },
        { layer: 4, type: "scenic", time: "Morning option", title: "⭐ Emerald Lake", note: "Yoho NP · 30 min detour via Field BC. Vivid emerald water, 5km loop trail. Canoe rentals $90/hr", lat: 51.4434375, lng: -116.5307693 },
        { layer: 4, type: "activity", time: "Afternoon", title: "🚡 Banff Gondola", note: "Sulphur Mountain · Ride to 2,281m, 360° views", lat: 51.1479321, lng: -115.555465 },
        { layer: 4, type: "hike", time: "OR afternoon", title: "🥾 Tunnel Mountain", note: "2.3km, 260m gain from townsite. ~1.5 hrs, great Bow Valley views", lat: 51.1753469, lng: -115.5618683, difficulty: "moderate" },
        { layer: 4, type: "hot_spring", time: "Late afternoon", title: "♨️ Banff Upper Hot Springs", note: "Historic pool at 1,585m. Open from 10 AM", lat: 51.1507689, lng: -115.560991 },
        { layer: 1, type: "hotel", time: "Evening", title: "Canmore Airbnb", note: "Check in - 3 nights", lat: 51.089, lng: -115.359 }
      ]
    },
    {
      id: 8,
      date: "Sun Jun 21",
      title: "Canmore Day 1",
      subtitle: "Settle in, stock up, pick your adventure",
      color: "#6B2D8B",
      emoji: "🥾",
      park: "banff",
      items: [
        { layer: 3, type: "market", time: "On arrival", title: "🥩 Valbella Gourmet Foods", note: "104 Elk Run Blvd · Legendary European deli since 1978. Rocky Mountain air-dried meats, sausages", lat: 51.0768197, lng: -115.3216483 },
        { layer: 3, type: "food", time: "On arrival", title: "☕ JK Bakery Café", note: "1000 7 Ave · Great soups, sandwiches, Boston cream donuts. Stock up for hike lunches", lat: 51.0903837, lng: -115.3612421 },
        { layer: 3, type: "market", time: "On arrival", title: "🛒 Safeway Canmore", note: "1200 Railway Ave · Well-stocked, on-site liquor store", lat: 51.093671, lng: -115.356288 },
        { layer: 4, type: "hike", time: "Full day option", title: "🥾 Johnston Canyon + Ink Pots", note: "Most recommended r/Banff hike. Canyon catwalks to 5 vivid turquoise springs. 11km, 5-6 hrs. Leave by 8 AM", lat: 51.2455293, lng: -115.8398977, difficulty: "moderate" },
        { layer: 4, type: "hike", time: "Full day option", title: "🥾 Larch Valley + Sentinel Pass", note: "r/Banff top pick. Start from Moraine Lake. Summit at 2,611m. 11km return, stunning", lat: 51.3405856, lng: -116.2216884, difficulty: "hard" },
        { layer: 4, type: "hike", time: "OR peaceful option", title: "🥾 Kananaskis: Rawson Lake", note: "45 min south on Hwy 40. 7.4km, 335m gain. Turquoise alpine lake, dramatic headwall. 4.9 stars, rarely crowded", lat: 50.609957599999994, lng: -115.11867529999998, difficulty: "moderate" },
        { layer: 4, type: "hike", time: "OR easy option", title: "🥾 Kananaskis: Troll Falls", note: "3.5km return, beautiful forest waterfall. 4.8 stars. Cave-like structures beyond falls", lat: 50.937069, lng: -115.14146799999999, difficulty: "easy" },
        { layer: 4, type: "hike", time: "OR stay local", title: "🥾 Grassi Lakes Trail", note: "5km from Canmore - crystal-clear lakes + ancient Cree pictographs. 2 hrs return", lat: 51.0783477, lng: -115.403065, difficulty: "moderate" },
        { layer: 4, type: "drive", time: "OR half day", title: "🦕 Royal Tyrrell Museum", note: "Drumheller · Open 9 AM-9 PM. Leave 8:30 AM → arrive 11 AM → 3 hrs museum → Horseshoe Canyon → back by 6 PM", lat: 51.4792097, lng: -112.7901466 }
      ]
    },
    {
      id: 9,
      date: "Mon Jun 22",
      title: "Canmore Day 2",
      subtitle: "Big hike day or Banff classics",
      color: "#6B2D8B",
      emoji: "🏔️",
      park: "banff",
      items: [
        { layer: 4, type: "activity", time: "Morning option", title: "⭐ Summer Skiing", note: "Banff Sunshine Village · Rare summer ski season Jun 20-Jul 5. One lift, several runs after record snowfall", lat: 51.1182, lng: -115.7632 },
        { layer: 4, type: "hike", time: "Morning option", title: "🥾 Ha Ling Peak", note: "Most iconic hike from Canmore - 5.4km, 745m gain. Ridgeline views over Bow Valley. Start by 7 AM", lat: 51.0614458, lng: -115.418039, difficulty: "hard" },
        { layer: 4, type: "hike", time: "Morning option", title: "🥾 East End of Rundle", note: "14km, 1,000m gain - one of best summit hikes. Not technical but serious - full day", lat: 51.0718, lng: -115.3447, difficulty: "hard" },
        { layer: 4, type: "scenic", time: "Afternoon", title: "📷 Vermilion Lakes + Bow Falls", note: "r/Banff must-dos. Vermilion: stunning Mt Rundle reflections. Bow Falls: 5 min walk from town", lat: 51.1807714, lng: -115.5941734 }
      ]
    },
    {
      id: 10,
      date: "Tue Jun 23",
      title: "Canmore → Revelstoke",
      subtitle: "Rafting day via Rogers Pass",
      color: "#8B1A1A",
      emoji: "🌊",
      park: null,
      items: [
        { layer: 3, type: "food", time: "9-10 AM", title: "🍳 Hot breakfast before you go", note: "Fuel up before raft. JK Bakery (opens 8 AM) or Safeway deli", lat: 51.0903837, lng: -115.3612421 },
        { layer: 2, type: "activity", time: "1:45-4:45 PM", title: "✅ Whitewater Rafting", note: "CONFIRMED · Wild Water Adventures · Kicking Horse River Class II-IV+ · Snacks at River Base after", lat: 51.300, lng: -116.963 },
        { layer: 4, type: "scenic", time: "En route", title: "📷 Rogers Pass", note: "Glacier NP · 1,382m summit, surrounded by massive peaks and glaciers", lat: 51.2833333, lng: -117.516666 },
        { layer: 1, type: "hotel", time: "Evening", title: "Boulder Mountain Resort", note: "2-bedroom cabin, last night", lat: 50.9913465, lng: -118.26293 }
      ]
    },
    {
      id: 11,
      date: "Wed Jun 24",
      title: "Revelstoke → Victoria",
      subtitle: "Home stretch via ferry",
      color: "#2D6A4F",
      emoji: "⛴️",
      park: null,
      items: [
        { layer: 4, type: "scenic", time: "~45 min", title: "📷 Three Valley Gap", note: "Quick pull-off on Hwy 1 - glacial lake with dramatic mountain reflections", lat: 50.933340799999996, lng: -118.44571399999998 },
        { layer: 4, type: "activity", time: "~1 hr", title: "🚂 Craigellachie - Last Spike", note: "Where last spike of Canadian Pacific Railway was driven in 1885. 15 min stop", lat: 50.9748665, lng: -118.72388819999999 },
        { layer: 3, type: "food", time: "Mid-morning", title: "☕ Blondies Cafe", note: "Sicamous · 302 Finlayson St · 4.5 stars. Great espresso, fresh baking, lovely yard", lat: 50.837157499999996, lng: -118.9891111 },
        { layer: 3, type: "food", time: "Lunch in Kamloops", title: "🍳 Hello Toast", note: "428 Victoria St · Kamloops' most popular brunch. Legendary eggs benny. Get there by noon", lat: 50.676030100000006, lng: -120.3311102 },
        { layer: 4, type: "food", time: "OR lunch", title: "🍽️ Mittz Kitchen", note: "227 Victoria St · Brisket sandwich, seasonal menu, great BC wines", lat: 50.6756418, lng: -120.3358865 },
        { layer: 2, type: "ferry", time: "9:00 PM", title: "✅ Tsawwassen → Swartz Bay", note: "CONFIRMED · Spirit of Vancouver Island · Arrives 10:35 PM", lat: 49.0069326, lng: -123.130321 },
        { layer: 1, type: "activity", time: "Evening", title: "Home sweet Victoria 🏡", note: "Trip complete - 10 days, ~2,400 km" }
      ]
    }
  ]
};

export const LAYER_NAMES = {
  1: "Must-Stops",
  2: "Reserved",
  3: "Road Utilities",
  4: "Optional"
};

export const ITEM_TYPES = {
  hotel: { icon: "🏨", label: "Hotels" },
  food: { icon: "🍽️", label: "Food" },
  hike: { icon: "🥾", label: "Hikes" },
  scenic: { icon: "📷", label: "Scenic" },
  activity: { icon: "⭐", label: "Activities" },
  drive: { icon: "🚗", label: "Driving" },
  wine: { icon: "🍷", label: "Wine" },
  ferry: { icon: "⛴️", label: "Ferry" },
  market: { icon: "🛒", label: "Markets" },
  glacier: { icon: "🧊", label: "Glaciers" },
  hot_spring: { icon: "♨️", label: "Hot Springs" }
};

export const HIKE_DIFFICULTIES = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Strenuous"
};
