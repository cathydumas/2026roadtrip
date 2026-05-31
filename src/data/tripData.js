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
        { layer: 2, type: "ferry", time: "10:00 AM", title: "✅ Swartz Bay Ferry", note: "Queen of New Westminster - check in 30-60 min early", lat: 48.6865, lng: -123.4105 },
        { layer: 3, type: "food", time: "Lunch in Hope", title: "🍽️ Home Restaurant", note: "665 Old Hope Princeton Way · Classic diner, huge portions, famous homemade pie", url: "https://www.homerestaurant.ca/", lat: 49.3758583, lng: -121.4271316 },
        { layer: 1, type: "hotel", time: "Late afternoon", title: "Comfort Suites Kelowna", note: "1 King + 1 Queen Suite · Check-in 4:00 PM · Confirmation #36565470 · 877-456-5770", url: "https://www.choicehotels.com/en-ca/reservations/reservation-details/36565470", lat: 49.8936661, lng: -119.4170556, coverPhoto: "/images/kelowna-comfort-suites.png" },
        { layer: 2, type: "wine", time: "7:30 PM", title: "✅ Mission Hill Winery", note: "Dinner reservation 7:30 PM", url: "https://www.missionhillwinery.com/terrace-restaurant/terrace-dinner-menu/", lat: 49.8351166, lng: -119.5867142, coverPhoto: "https://lh3.googleusercontent.com/p/AF1QipN7CM9UmnAtPSgRlX_nDoOwiRexgTfr5lkLQHe3=s1360-w1360-h1020-rw" }
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
        { layer: 4, type: "market", time: "Morning", title: "☕ 350° Bakehouse", note: "1892 Spall Rd · Open 7:30 AM. Sourdough loaves, pastries, sandwiches for the road", lat: 49.8793977, lng: -119.4551504 },
        { layer: 4, type: "market", time: "Morning", title: "🥩 Carnist Butcher", note: "1038 Richter St · Tue-Sat 10-6. Stock up on road trip meats and snacks", lat: 49.8966773, lng: -119.4887348 },
        { layer: 4, type: "market", time: "Morning", title: "🛒 Nature's Fare Market", note: "1876 Cooper Rd · Organic produce, quality groceries, bulk snacks. Best veg selection in Kelowna", lat: 49.8827, lng: -119.4537 },
        { layer: 3, type: "drive", time: "En route", title: "⛽ Fill up in Kamloops", note: "Last fuel before mountains", lat: 50.6745, lng: -120.3273 },
        { layer: 3, type: "food", time: "Lunch", title: "☕ Wild Flour Cafe", note: "Clearwater · Fresh sourdough, homemade baking", url: "https://www.wildflourcafe.ca/menu-with-tabs/", lat: 51.6521206, lng: -120.0389419 },
        { layer: 3, type: "activity", time: "En route", title: "⛽ Fill up in Valemount", note: "Last fuel before Jasper", lat: 52.8321, lng: -119.2626 },
        { layer: 3, type: "scenic", time: "~10 min stop", title: "📷 Mt Robson Viewpoint (highway)", note: "Best unobstructed view of the peak (3,954m) with river foreground. Pulloff on Hwy 16 eastbound, before the visitor centre. Often has cloud cap - stop if it's clear!", lat: 53.0940, lng: -119.1770, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/2/28/Mount_Robson_08122005.jpg" },
        { layer: 3, type: "scenic", time: "~30 min stop", title: "📷 Mt Robson Visitor Centre", note: "Open 8 AM - 5 PM (mid-Jun to Sep). Info, washrooms, and short walk to Overlander Falls (10 min each way, easy, waterfall through canyon). Second angle on the peak.", lat: 53.1148, lng: -119.2314, coverPhoto: "https://assets.hellobc.com/unsafe/1000x800/smart/https%3A/media-cdn.tripadvisor.com/media/photo-o/16/22/29/af/mount-robson-visitor.jpg" },
        { layer: 3, type: "drive", time: "On arrival", title: "ℹ️ Jasper Visitor Centre", note: "500 Connaught Dr · Open 9 AM - 7 PM (summer). Park passes, maps, trail conditions, bear warnings", lat: 52.8773, lng: -118.0808 },
        { layer: 1, type: "hotel", time: "Evening", title: "Patricia Lake Bungalows", note: "Maple Cabin · 3 nights · Check-in 4:00 PM · Confirmation #50910413 · 780-852-3560", url: "https://www.patricialakebungalows.com/maple-cabin", lat: 52.902511, lng: -118.097846, coverPhoto: "https://www.patricialakebungalows.com/uploads/files/Maple%20Exterior%20.jpg", photos: [
          'https://www.patricialakebungalows.com/uploads/thumbnails/ViewFromCouch.jpg.7394f860.jpg',
          'https://www.patricialakebungalows.com/uploads/thumbnails/firepleace.jpg.3ec522a8.jpg',
          'https://www.patricialakebungalows.com/uploads/thumbnails/KingBed.jpg.3b74bb79.jpg',
          'https://www.patricialakebungalows.com/uploads/thumbnails/Kitchen2.jpg.5a98b808.jpg',
          'https://www.patricialakebungalows.com/uploads/thumbnails/LivingRoom.jpg.27c0b7a2.jpg',
          'https://www.patricialakebungalows.com/uploads/thumbnails/MasterBathroom.jpg.3afb7502.jpg',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/boats-collage.webp',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/swimming.webp',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/hot-tub.webp',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/bbq.webp',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/fire-pits.webp',
          'https://www.patricialakebungalows.com/uploads/files/Images/Activities/playground.webp'
        ] }
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
        { layer: 4, type: "market", time: "Morning", title: "🛒 Robinson's IGA", note: "218 Connaught Dr · Full grocery, deli counter. Only real supermarket in Jasper", lat: 52.8741, lng: -118.0811 },
        { layer: 3, type: "scenic", time: "Afternoon", title: "📷 Maligne Canyon", note: "7 km from Jasper · Dramatic limestone gorge with 6 bridges over rushing water. Short walks (15-30 min) to see bridges 1-3", lat: 52.9198, lng: -118.0102, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/f/f8/A_crack_on_earth.jpg" },
        { layer: 3, type: "scenic", time: "En route", title: "📷 Medicine Lake", note: "25 km from Jasper · Famous disappearing lake (drains underground in fall/winter). Multiple pullouts along east shore for photos", lat: 52.8100, lng: -117.7600, coverPhoto: "https://images.unsplash.com/photo-1588970423867-1dce75e14abe?w=1200" },
        { layer: 2, type: "activity", time: "5-9 PM", title: "✅ Maligne Lake Fishing", note: "Jasper Park Fishing · CONFIRMED · 48 km from Jasper (50-60 min drive) · Meet at \"Top of the personal craft boat launch\" · Park at Maligne Lake Boat House parking lot · Arrive 15-30 min early for lakeshore walk", lat: 52.7260, lng: -117.6444, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Maligne_Lake_in_Jasper_National_Park_17.jpg/1200px-Maligne_Lake_in_Jasper_National_Park_17.jpg" }
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
        { layer: 4, type: "market", time: "11 AM - 3 PM", title: "🧑‍🌾 Jasper Farmers Market", note: "701 Turret St · Wednesdays in summer · Local produce, baked goods, crafts", lat: 52.8755, lng: -118.0828 },
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
        { layer: 2, type: "scenic", time: "~30 min from Jasper", title: "📷 Athabasca Falls", note: "Most powerful waterfall in the Rockies. Paved loop trail (1km, 15 min) with multiple viewpoints and canyon bridges", lat: 52.664437, lng: -117.883767, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/9/91/Athabasca_Falls_-_Jasper.jpg" },
        { layer: 2, type: "scenic", time: "~30 min stop", title: "📷 Sunwapta Falls", note: "Dramatic canyon waterfall. Easy 600m walk from parking lot. Continue 1km further to Lower Sunwapta Falls (quieter, almost no people)", lat: 52.5327, lng: -117.6438, coverPhoto: "https://images.unsplash.com/photo-1575403052258-f92b24125eb2?w=1200" },
        { layer: 2, type: "glacier", time: "⚠️ 11:15 AM arrival", title: "✅ Columbia Icefield", note: "CONFIRMED · Ice Explorer + Skywalk · Must arrive at 11:15 with ticket ready · Wear hiking shoes", glacierTempDelta: -15, lat: 52.2201943, lng: -117.226141, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Columbia_icefield_view.jpg" },
        { layer: 4, type: "hike", time: "Optional 3-4 hrs", title: "🥾 Wilcox Pass Trailhead", note: "8km return, 335m gain · Alpine meadows with jaw-dropping views of Columbia Icefield from above · Wildflowers in June · Trailhead across highway from Icefield Centre", lat: 52.2180, lng: -117.2230 },
        { layer: 3, type: "drive", time: "Mid-afternoon", title: "⛽ Saskatchewan River Crossing", note: "Only gas between Jasper & Lake Louise", lat: 51.9338, lng: -116.8319 },
        { layer: 2, type: "scenic", time: "~45 min stop", title: "📷 Peyto Lake + Bow Summit", note: "Wolf-shaped turquoise lake from Bow Summit lookout. 10-min paved walk to main viewpoint, OR 40-min loop trail along the ridgeline for even better angles (easy, well-marked)", lat: 51.7171414, lng: -116.507574, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/9/91/Peyto_Lake-Banff_NP-Canada.jpg" },
        { layer: 2, type: "scenic", time: "~30 min stop", title: "📷 Bow Lake", note: "Stunning glacial lake right off the highway. Walk along the shore to Bow Glacier Falls trailhead (20 min each way, flat, wildflowers). Full hike to falls is 9km return, 3 hrs", lat: 51.6769, lng: -116.4458, coverPhoto: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Bow_Lake_2.jpg" },
        { layer: 3, type: "drive", time: "Late afternoon", title: "ℹ️ Lake Louise Visitor Centre", note: "Samson Mall · Open 9 AM - 5 PM (summer). Trail updates, bear activity, Moraine shuttle info", lat: 51.4267, lng: -116.1775 },
        { layer: 1, type: "hotel", time: "Evening", title: "Paradise Lodge", note: "Saddleback Suite (Queen + 2 Twin) · 2 nights · Check-in 8:00 AM-9:30 PM at Main Lodge · Confirmation #1059211922 · 403-760-7555", url: "https://paradiselodge.com/suites/", lat: 51.4161708, lng: -116.196697, coverPhoto: "https://paradiselodge.com/wp-content/uploads/2025/03/Saddleback-Suite-1-1080-1.jpg", photos: [
          'https://paradiselodge.com/wp-content/uploads/2025/03/Saddleback-Suite-2-1080.jpg',
          'https://paradiselodge.com/wp-content/uploads/2025/02/Saddleback-Twin-Suite-1.jpg',
          'https://paradiselodge.com/wp-content/uploads/2025/03/Saddleback-Suite-3-1080-1.jpg',
          'https://paradiselodge.com/wp-content/uploads/2025/03/temple-suite-bathroom.jpg',
          'https://paradiselodge.com/wp-content/uploads/2025/02/Saddleback-Suite-Floor-Plan.jpg'
        ] }
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
        { layer: 2, type: "food", time: "12:15 PM", title: "✅ Lakeview Lounge", note: "Chateau Lake Louise · Lunch reservation", url: "https://www.fairmont.com/lake-louise/dining/lakeviewlounge/", lat: 51.4163, lng: -116.2138 },
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
        { layer: 3, type: "drive", time: "Afternoon", title: "ℹ️ Banff Visitor Centre", note: "224 Banff Ave · Open 9 AM - 7 PM (summer). Park passes, trail conditions, wildlife alerts. Park at train station (free), 5 min walk north", lat: 51.1780, lng: -115.5702 },
        { layer: 1, type: "hotel", time: "Evening", title: "Canmore Airbnb", note: "Hot Tub | Pool | Mountain Getaway | 2 BR · 140 Kananaskis Way · 3 nights · Check-in after 4:00 PM", url: "https://www.airbnb.ca/rooms/50138595", lat: 51.0865, lng: -115.3424, coverPhoto: "/images/canmore-airbnb/2.jpg", photos: [
          '/images/canmore-airbnb/1.jpg',
          '/images/canmore-airbnb/3.jpg',
          '/images/canmore-airbnb/4.jpg',
          '/images/canmore-airbnb/5.jpg',
          '/images/canmore-airbnb/6.jpg',
          '/images/canmore-airbnb/7.jpg',
          '/images/canmore-airbnb/8.jpg',
          '/images/canmore-airbnb/9.jpg'
        ] }
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
      startAccom: { title: "Canmore Airbnb", lat: 51.0865, lng: -115.3424 },
      items: [
        { layer: 4, type: "market", time: "On arrival", title: "🥩 Valbella Gourmet Foods", note: "104 Elk Run Blvd · Legendary European deli since 1978. Rocky Mountain air-dried meats, sausages", lat: 51.0768197, lng: -115.3216483 },
        { layer: 4, type: "market", time: "On arrival", title: "☕ JK Bakery Cafe", note: "1000 7 Ave · Great soups, sandwiches, Boston cream donuts. Stock up for hike lunches", lat: 51.0903837, lng: -115.3612421 },
        { layer: 4, type: "market", time: "On arrival", title: "🛒 Safeway Canmore", note: "1200 Railway Ave · Well-stocked, on-site liquor store", lat: 51.093671, lng: -115.356288 }
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
      startAccom: { title: "Canmore Airbnb", lat: 51.0865, lng: -115.3424 },
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
      startAccom: { title: "Canmore Airbnb", lat: 51.0865, lng: -115.3424 },
      items: [
        { layer: 3, type: "food", time: "9-10 AM", title: "🍳 Hot breakfast before you go", note: "Fuel up before raft. JK Bakery (opens 8 AM) or Safeway deli", url: "https://www.jkbakery.ca/", lat: 51.0903837, lng: -115.3612421 },
        { layer: 2, type: "activity", time: "1:45-4:45 PM", title: "✅ Whitewater Rafting", note: "CONFIRMED · Wild Water Adventures · Kicking Horse River Class II-IV+ · Snacks at River Base after", lat: 51.300, lng: -116.963 },
        { layer: 3, type: "scenic", time: "En route", title: "📷 Rogers Pass", note: "Glacier NP · 1,382m summit, surrounded by massive peaks and glaciers", lat: 51.2833, lng: -117.5167, coverPhoto: "https://images.unsplash.com/photo-1610141353646-14306dc6a9ab?w=1200" },
        { layer: 1, type: "hotel", time: "Evening", title: "Boulder Mountain Resort", note: "Two-Bedroom Cabin · 1 night · Check-in 4:00 PM · Confirmation #50912114 · 250-837-4420", url: "https://bouldermountainresort.ca/lodging/two-bedroom-cabins/", lat: 50.9913465, lng: -118.26293, coverPhoto: "https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2462.jpg", photos: [
          'https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2607.jpg',
          'https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2625.jpg',
          'https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2501-Edit.jpg',
          'https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2472-Edit.jpg',
          'https://bouldermountainresort.ca/wp-content/uploads/2022/12/IMG_2523.jpg'
        ] }
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
        { layer: 3, type: "scenic", time: "~45 min", title: "📷 Three Valley Gap", note: "Quick pull-off on Hwy 1 - glacial lake with dramatic mountain reflections", lat: 50.9333, lng: -118.4457, coverPhoto: "https://images.unsplash.com/photo-1501624617501-754b31a56d61?w=1200" },
        { layer: 3, type: "scenic", time: "~1 hr", title: "🚂 Craigellachie - Last Spike", note: "Where the last spike of the Canadian Pacific Railway was driven in 1885. 15 min stop", lat: 50.9749, lng: -118.7239 },
        { layer: 3, type: "food", time: "Mid-morning", title: "☕ Blondies Cafe", note: "Sicamous · 302 Finlayson St · 4.5 stars. Great espresso, fresh baking, lovely yard", lat: 50.837157499999996, lng: -118.9891111 },
        { layer: 3, type: "food", time: "Lunch in Kamloops", title: "🍳 Hello Toast", note: "428 Victoria St · Kamloops' most popular brunch. Legendary eggs benny. Get there by noon", url: "https://www.hellotoast.ca/menu", lat: 50.676030100000006, lng: -120.3311102 },
        { layer: 2, type: "ferry", time: "9:00 PM", title: "✅ Tsawwassen → Swartz Bay", note: "CONFIRMED · Spirit of Vancouver Island · Arrives 10:35 PM", lat: 49.0069326, lng: -123.130321 },
        { layer: 1, type: "activity", time: "Evening", title: "Home sweet Victoria", note: "Trip complete - 10 days, ~2,400 km" }
      ]
    }
  ]
};

export const LAYER_NAMES = {
  1: "Accommodations",
  2: "Booked Activities",
  3: "Road Stops",
  4: "Groceries"
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

