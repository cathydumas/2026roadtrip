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
