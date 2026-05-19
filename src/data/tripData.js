// Layer definitions:
// 1 = Must-stop (booked hotels) - always visible
// 2 = Reserved (confirmed excursions & restaurant reservations)
// 3 = Road utilities (gas, lunch suggestions, waypoints)
// Layer 4 items have been moved to activities.js (Explore panel)

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
      km: 480,
      items: [
        { layer: 2, type: "ferry", time: "10:00 AM", title: "✅ Swartz Bay Ferry", note: "Queen of New Westminster - check in 30-60 min early", lat: 48.68826, lng: -123.41201 },
        { layer: 3, type: "food", time: "Lunch in Hope", title: "🍽️ Home Restaurant", note: "665 Old Hope Princeton Way · Classic diner, huge portions, famous homemade pie", lat: 49.3758583, lng: -121.4271316 },
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
      km: 570,
      startAccom: { title: "Comfort Suites Kelowna", lat: 49.8936661, lng: -119.4170556 },
      items: [
        { layer: 3, type: "food", time: "Morning", title: "☕ 350° Bakehouse", note: "1892 Spall Rd - open 7:30 AM", lat: 49.8793977, lng: -119.4551504 },
        { layer: 3, type: "market", time: "Morning", title: "🥩 Carnist Butcher", note: "1038 Richter St · Tue-Sat 10-6. Stock up on road trip meats and snacks", lat: 49.8966773, lng: -119.4887348 },
        { layer: 3, type: "drive", time: "En route", title: "⛽ Fill up in Kamloops", note: "Last fuel before mountains", lat: 50.6745, lng: -120.3273 },
        { layer: 3, type: "food", time: "Lunch", title: "☕ Wild Flour Cafe", note: "Clearwater · Fresh sourdough, homemade baking", lat: 51.6521206, lng: -120.0389419 },
        { layer: 3, type: "activity", time: "En route", title: "⛽ Fill up in Valemount", note: "Last fuel before Jasper", lat: 52.8321, lng: -119.2626 },
        { layer: 3, type: "scenic", time: "~20 min stop", title: "📷 Mt Robson Viewpoint", note: "Highest peak in the Canadian Rockies (3,954m). Pull off at the visitor centre for the classic photo op. Often has cloud cap.", lat: 53.1148, lng: -119.2314 },
        { layer: 3, type: "drive", time: "On arrival", title: "ℹ️ Jasper Visitor Centre", note: "500 Connaught Dr · Park passes, maps, trail conditions, bear warnings", lat: 52.8734, lng: -118.0817 },
        { layer: 1, type: "hotel", time: "Evening", title: "Patricia Lake Bungalows", note: "Maple Cabin, 3 nights", lat: 52.902511, lng: -118.097846 }
      ]
    },
    {
      id: 3,
      date: "Tue Jun 16",
      title: "Jasper Day 1",
      subtitle: "Maligne Lake + fishing",
      color: "#1B4332",
      emoji: "🎣",
      park: "jasper",
      km: 95,
      startAccom: { title: "Patricia Lake Bungalows", lat: 52.902511, lng: -118.097846 },
      items: [
        { layer: 3, type: "activity", time: "Morning", title: "🐻 Buy Bear Spray", note: "Everest Outdoor · ~$50-60 each, get 3", lat: 52.87809120000001, lng: -118.07995149999998 },
        { layer: 2, type: "activity", time: "5-9 PM", title: "✅ Maligne Lake Fishing", note: "Jasper Park Fishing · CONFIRMED", lat: 52.6654279, lng: -117.5345287 }
      ]
    },
    {
      id: 4,
      date: "Wed Jun 17",
      title: "Jasper Day 2",
      subtitle: "Pick your adventure",
      color: "#1B4332",
      emoji: "♨️",
      park: "jasper",
      km: 0,
      startAccom: { title: "Patricia Lake Bungalows", lat: 52.902511, lng: -118.097846 },
      items: [
        { layer: 3, type: "drive", time: "On way home", title: "⛽ Fill up in Jasper", note: "Fill tonight - leaving early tomorrow", lat: 52.8734, lng: -118.0817 }
      ]
    },
    {
      id: 5,
      date: "Thu Jun 18",
      title: "Jasper → Lake Louise",
      subtitle: "Icefields Parkway - the whole point is the drive",
      color: "#0A3D62",
      emoji: "❄️",
      park: "banff",
      km: 230,
      startAccom: { title: "Patricia Lake Bungalows", lat: 52.902511, lng: -118.097846 },
      items: [
        { layer: 2, type: "scenic", time: "~30 min from Jasper", title: "📷 Athabasca Falls", note: "Most powerful waterfall in the Rockies. Short paved walk, multiple viewpoints", lat: 52.664437, lng: -117.883767 },
        { layer: 2, type: "scenic", time: "~20 min stop", title: "📷 Sunwapta Falls", note: "Dramatic canyon waterfall. Easy 600m walk from parking lot", lat: 52.5327, lng: -117.6438 },
        { layer: 2, type: "glacier", time: "11:30 AM", title: "✅ Columbia Icefield", note: "CONFIRMED · Ice Explorer + Skywalk", lat: 52.2201943, lng: -117.226141 },
        { layer: 3, type: "drive", time: "Mid-afternoon", title: "⛽ Saskatchewan River Crossing", note: "Only gas between Jasper & Lake Louise", lat: 51.9338, lng: -116.8319 },
        { layer: 2, type: "scenic", time: "~30 min stop", title: "📷 Peyto Lake", note: "Wolf-shaped turquoise lake from Bow Summit lookout. 10-min walk to viewpoint", lat: 51.7171414, lng: -116.507574 },
        { layer: 2, type: "scenic", time: "~20 min stop", title: "📷 Bow Lake", note: "Stunning glacial lake right off the highway. Walk along the shore or just take in the view from the parking area", lat: 51.6769, lng: -116.4458 },
        { layer: 3, type: "drive", time: "Late afternoon", title: "ℹ️ Lake Louise Visitor Centre", note: "Samson Mall · Trail updates, bear activity, Moraine shuttle info", lat: 51.4267, lng: -116.1775 },
        { layer: 1, type: "hotel", time: "Evening", title: "Paradise Lodge", note: "Saddleback Suite, 2 nights", lat: 51.4161708, lng: -116.196697 }
      ]
    },
    {
      id: 6,
      date: "Fri Jun 19",
      title: "Lake Louise Day",
      subtitle: "Moraine Lake + lakeshore",
      color: "#0A3D62",
      emoji: "🏔️",
      park: "banff",
      km: 30,
      startAccom: { title: "Paradise Lodge", lat: 51.4161708, lng: -116.196697 },
      items: [
        { layer: 2, type: "food", time: "12:15 PM", title: "✅ Lakeview Lounge", note: "Chateau Lake Louise · Lunch reservation", lat: 51.4163, lng: -116.2138 },
        { layer: 2, type: "activity", time: "4:00-5:00 PM", title: "✅ Moraine Lake Shuttle", note: "CONFIRMED · 3 adults · Depart Park & Ride · Shuttles every 30 min", lat: 51.4412008, lng: -116.162196 },
        { layer: 3, type: "activity", time: "⚠️ 7:30 PM", title: "🚌 LAST SHUTTLE back from Moraine Lake", note: "DO NOT MISS - no cell service, no lights, no way to call for help after this. Leave trailhead by 7:00 PM", lat: 51.3282264, lng: -116.179504 }
      ]
    },
    {
      id: 7,
      date: "Sat Jun 20",
      title: "Lake Louise → Banff → Canmore",
      subtitle: "Travel day + Banff townsite",
      color: "#6B2D8B",
      emoji: "♨️",
      park: "banff",
      km: 80,
      startAccom: { title: "Paradise Lodge", lat: 51.4161708, lng: -116.196697 },
      items: [
        { layer: 3, type: "drive", time: "Afternoon", title: "ℹ️ Banff Visitor Centre", note: "224 Banff Ave · Park passes, trail conditions, wildlife alerts", lat: 51.1784, lng: -115.5708 },
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
      km: 0,
      startAccom: { title: "Canmore Airbnb", lat: 51.089, lng: -115.359 },
      items: [
        { layer: 3, type: "market", time: "On arrival", title: "🥩 Valbella Gourmet Foods", note: "104 Elk Run Blvd · Legendary European deli since 1978. Rocky Mountain air-dried meats, sausages", lat: 51.0768197, lng: -115.3216483 },
        { layer: 3, type: "food", time: "On arrival", title: "☕ JK Bakery Cafe", note: "1000 7 Ave · Great soups, sandwiches, Boston cream donuts. Stock up for hike lunches", lat: 51.0903837, lng: -115.3612421 },
        { layer: 3, type: "market", time: "On arrival", title: "🛒 Safeway Canmore", note: "1200 Railway Ave · Well-stocked, on-site liquor store", lat: 51.093671, lng: -115.356288 }
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
      km: 0,
      startAccom: { title: "Canmore Airbnb", lat: 51.089, lng: -115.359 },
      items: []
    },
    {
      id: 10,
      date: "Tue Jun 23",
      title: "Canmore → Revelstoke",
      subtitle: "Rafting day via Rogers Pass",
      color: "#8B1A1A",
      emoji: "🌊",
      park: null,
      km: 360,
      startAccom: { title: "Canmore Airbnb", lat: 51.089, lng: -115.359 },
      items: [
        { layer: 3, type: "food", time: "9-10 AM", title: "🍳 Hot breakfast before you go", note: "Fuel up before raft. JK Bakery (opens 8 AM) or Safeway deli", lat: 51.0903837, lng: -115.3612421 },
        { layer: 2, type: "activity", time: "1:45-4:45 PM", title: "✅ Whitewater Rafting", note: "CONFIRMED · Wild Water Adventures · Kicking Horse River Class II-IV+ · Snacks at River Base after", lat: 51.300, lng: -116.963 },
        { layer: 3, type: "scenic", time: "En route", title: "📷 Rogers Pass", note: "Glacier NP · 1,382m summit, surrounded by massive peaks and glaciers", lat: 51.2833, lng: -117.5167 },
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
      km: 700,
      startAccom: { title: "Boulder Mountain Resort", lat: 50.9913465, lng: -118.26293 },
      items: [
        { layer: 3, type: "scenic", time: "~45 min", title: "📷 Three Valley Gap", note: "Quick pull-off on Hwy 1 - glacial lake with dramatic mountain reflections", lat: 50.9333, lng: -118.4457 },
        { layer: 3, type: "scenic", time: "~1 hr", title: "🚂 Craigellachie - Last Spike", note: "Where the last spike of the Canadian Pacific Railway was driven in 1885. 15 min stop", lat: 50.9749, lng: -118.7239 },
        { layer: 3, type: "food", time: "Mid-morning", title: "☕ Blondies Cafe", note: "Sicamous · 302 Finlayson St · 4.5 stars. Great espresso, fresh baking, lovely yard", lat: 50.837157499999996, lng: -118.9891111 },
        { layer: 3, type: "food", time: "Lunch in Kamloops", title: "🍳 Hello Toast", note: "428 Victoria St · Kamloops' most popular brunch. Legendary eggs benny. Get there by noon", lat: 50.676030100000006, lng: -120.3311102 },
        { layer: 2, type: "ferry", time: "9:00 PM", title: "✅ Tsawwassen → Swartz Bay", note: "CONFIRMED · Spirit of Vancouver Island · Arrives 10:35 PM", lat: 49.0069326, lng: -123.130321 },
        { layer: 1, type: "activity", time: "Evening", title: "Home sweet Victoria", note: "Trip complete - 10 days, ~2,400 km" }
      ]
    }
  ]
};

export const LAYER_NAMES = {
  1: "Accommodations",
  2: "Booked Activities",
  3: "Road Stops"
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

