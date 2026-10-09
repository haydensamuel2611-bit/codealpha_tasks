const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Password hash helper using built-in crypto
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

// Initial seed products
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "NovaSound Apex Wireless ANC Headphones",
    tagline: "Immersive studio-grade acoustic clarity with active noise cancellation",
    category: "Audio & Wearables",
    price: 249.99,
    originalPrice: 329.99,
    rating: 4.9,
    reviewCount: 1280,
    badge: "BESTSELLER",
    badgeType: "accent",
    stock: 24,
    colors: ["#111827", "#f3f4f6", "#f43f5e", "#3b82f6"],
    colorNames: ["Midnight Black", "Glacier White", "Rose Crimson", "Cobalt Blue"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Hybrid Active Noise Cancellation with 4 external microphones",
      "Up to 45 hours battery life with ultra-fast Type-C charging",
      "Custom 40mm titanium drivers delivering Hi-Res audio certification",
      "Multipoint Bluetooth 5.3 connection with seamless device switching"
    ],
    specs: {
      "Driver Size": "40mm Titanium Plated",
      "Battery Life": "45 Hours (ANC ON)",
      "Charging Time": "15 min for 5 hours playback",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.3 / 3.5mm Aux",
      "Warranty": "2 Years Official Warranty"
    },
    reviews: [
      { user: "Marcus V.", rating: 5, date: "2026-08-14", comment: "The soundstage is breathtaking. Noise cancellation easily rivals $400 headsets!" },
      { user: "Sarah L.", rating: 5, date: "2026-08-28", comment: "Super comfortable for all-day coding sessions. Battery lasts almost two weeks." }
    ]
  },
  {
    id: "prod-2",
    name: "CyberVision Ultra 4K Smart Cinema Projector",
    tagline: "Turn your living room into an IMAX theater with vibrant laser projection",
    category: "Tech & Gadgets",
    price: 499.00,
    originalPrice: 599.00,
    rating: 4.8,
    reviewCount: 840,
    badge: "HOT DEAL",
    badgeType: "hot",
    stock: 12,
    colors: ["#1e293b", "#e2e8f0"],
    colorNames: ["Space Titanium", "Arctic Frost"],
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "True 4K UHD resolution with HDR10+ and 2400 ANSI Lumens brightness",
      "Auto keystone correction and intelligent obstacle avoidance in 2 seconds",
      "Dual 10W Harman Kardon acoustic speakers with Dolby Digital Plus",
      "Built-in Google TV with Netflix, Disney+, Prime, and Chromecast"
    ],
    specs: {
      "Resolution": "3840 x 2160 (4K UHD)",
      "Brightness": "2400 ANSI Lumens",
      "Screen Size": "40\" to 200\" Diagonal",
      "Operating System": "Google TV OS",
      "Ports": "2x HDMI 2.1, 2x USB 3.0, Optical, eARC",
      "Lifespan": "30,000 Hours Laser Diode"
    },
    reviews: [
      { user: "David K.", rating: 5, date: "2026-09-02", comment: "Crisp picture even in daylight with curtains drawn. Kids love movie night!" },
      { user: "Priya S.", rating: 4, date: "2026-09-12", comment: "Setup was zero effort thanks to auto-keystone. Superb audio too." }
    ]
  },
  {
    id: "prod-3",
    name: "ChronoPulse Quantum Smartwatch 2",
    tagline: "Aerospace titanium casing with sapphire glass and medical-grade bio-sensors",
    category: "Audio & Wearables",
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.7,
    reviewCount: 2150,
    badge: "SALE 20%",
    badgeType: "sale",
    stock: 38,
    colors: ["#0f172a", "#94a3b8", "#f97316"],
    colorNames: ["Obsidian Black", "Titanium Silver", "Sunset Tangerine"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "1.43-inch Always-On Retina AMOLED display with 1000 nits peak brightness",
      "Continuous ECG, SpO2 blood oxygen, HRV stress monitoring, and sleep tracking",
      "Over 120 sports modes with dual-frequency precision GPS",
      "14-day extended battery life and 5ATM water resistance up to 50 meters"
    ],
    specs: {
      "Display": "1.43\" AMOLED 466x466 (326 PPI)",
      "Battery Life": "Up to 14 Days",
      "Water Resistance": "5 ATM / 50 Meters",
      "Sensors": "BioTracker 4.0, ECG, Accelerometer, Barometer",
      "Compatibility": "iOS & Android"
    },
    reviews: [
      { user: "Elena R.", rating: 5, date: "2026-08-19", comment: "The titanium finish looks and feels like a $900 luxury timepiece." }
    ]
  },
  {
    id: "prod-4",
    name: "Vortex Pro RGB Mechanical Gaming Keyboard",
    tagline: "Hot-swappable tactile switches, gasket-mounted sound dampening, CNC alloy body",
    category: "Gaming & Gear",
    price: 129.50,
    originalPrice: 160.00,
    rating: 4.9,
    reviewCount: 930,
    badge: "TOP RATED",
    badgeType: "accent",
    stock: 18,
    colors: ["#18181b", "#6366f1", "#f43f5e"],
    colorNames: ["Phantom Shadow", "Cyber Violet", "Laser Neon"],
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Pre-lubed custom creamy linear switches with gasket mount engineering",
      "Double-shot PBT keycaps resistant to oil and fingerprint wear",
      "Per-key south-facing RGB backlighting with 22 dynamic animation modes",
      "Tri-mode connectivity: Bluetooth 5.2, 2.4G low-latency wireless, and Type-C"
    ],
    specs: {
      "Layout": "75% Compact (82 Keys + Rotary Knob)",
      "Switch Type": "Gateron Pro Yellow Linear",
      "Battery": "4000mAh Lithium Rechargeable",
      "Polling Rate": "1000Hz Ultra-Low Latency",
      "Weight": "980g Solid Feel"
    },
    reviews: [
      { user: "Tyler B.", rating: 5, date: "2026-09-08", comment: "The thock sound out of the box is unmatched. Best keyboard purchase of my life!" }
    ]
  },
  {
    id: "prod-5",
    name: "AuraGlow Smart Ambient Neon Light Bar",
    tagline: "Synchronized dynamic room illumination that pulses with your games and music",
    category: "Smart Home",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewCount: 670,
    badge: "POPULAR",
    badgeType: "new",
    stock: 45,
    colors: ["#000000", "#ffffff"],
    colorNames: ["Matte Obsidian", "Pure White"],
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "16 million colors with multi-zone segment RGBIC illumination",
      "Real-time screen color matching camera and microphone audio sync",
      "Works effortlessly with Alexa, Google Assistant, and Apple Home",
      "Modular dual-orientation desktop stands or wall mount included"
    ],
    specs: {
      "LED Channels": "32 Independent Addressable Zones",
      "Connectivity": "Wi-Fi 2.4GHz + Bluetooth BLE",
      "Control": "Smartphone App / Voice / Controller Bar",
      "Cable Length": "2.5m Braided Cable"
    },
    reviews: [
      { user: "Leo M.", rating: 5, date: "2026-07-22", comment: "Transforms the whole desk setup vibe completely!" }
    ]
  },
  {
    id: "prod-6",
    name: "LuxeCraft Minimalist Leather Travel Backpack",
    tagline: "Full-grain weatherproof Italian leather with dedicated 16\" laptop armor",
    category: "Fashion & Apparel",
    price: 119.00,
    originalPrice: 159.00,
    rating: 4.8,
    reviewCount: 520,
    badge: "TRENDING",
    badgeType: "hot",
    stock: 15,
    colors: ["#78350f", "#1c1917", "#365314"],
    colorNames: ["Heritage Cognac", "Midnight Noir", "Nordic Olive"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Handcrafted from water-resistant top-grain Italian leather",
      "Padded air-cushioned compartment holds up to 16\" MacBook Pro",
      "Hidden anti-theft RFID passport and card protection pocket",
      "Luggage pass-through strap for effortless airport travel"
    ],
    specs: {
      "Capacity": "22 Liters",
      "Dimensions": "44 x 30 x 14 cm",
      "Material": "Full-Grain Italian Calfskin",
      "Zippers": "YKK Weatherproof Seal",
      "Weight": "1.1 kg"
    },
    reviews: [
      { user: "Claire H.", rating: 5, date: "2026-08-30", comment: "Gets compliments wherever I go. Fits under plane seats perfectly." }
    ]
  },
  {
    id: "prod-7",
    name: "PhantomX Ultralight Wireless Gaming Mouse",
    tagline: "Weighing only 53 grams with 30,000 DPI optical sensor and 4K polling",
    category: "Gaming & Gear",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.9,
    reviewCount: 1120,
    badge: "NEW ARRIVAL",
    badgeType: "new",
    stock: 29,
    colors: ["#09090b", "#f8fafc", "#eab308"],
    colorNames: ["Onyx Black", "Chalk White", "Cyber Yellow"],
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Featherlight 53g honeycomb-free solid shell construction",
      "Flagship 30K optical sensor with 750 IPS tracking speed",
      "Optical gen-3 switches rated for 90 million crispy clicks without double-click",
      "95 hours continuous battery life with fast magnetic dock support"
    ],
    specs: {
      "Weight": "53 Grams Ultra-Light",
      "DPI Range": "100 - 30,000 DPI",
      "Sensor": "PAW3395 Optical Flagship",
      "Skates": "100% Virgin Grade PTFE",
      "Polling Rate": "4000Hz Wireless Compatible"
    },
    reviews: [
      { user: "Nathan T.", rating: 5, date: "2026-09-18", comment: "My aim in CS2 and Valorant improved instantly. The glide is like ice!" }
    ]
  },
  {
    id: "prod-8",
    name: "AeroSound Horizon True Wireless ANC Earbuds",
    tagline: "Dynamic spatial 3D audio with active noise cancel and sapphire glass touch",
    category: "Audio & Wearables",
    price: 99.00,
    originalPrice: 139.00,
    rating: 4.7,
    reviewCount: 1840,
    badge: "SALE 30%",
    badgeType: "sale",
    stock: 52,
    colors: ["#7c3aed", "#0284c7", "#18181b"],
    colorNames: ["Cosmic Violet", "Lagoon Blue", "Carbon Black"],
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Adaptive Active Noise Cancellation reducing ambient noise up to 48dB",
      "Spatial audio head-tracking for an authentic live concert experience",
      "36 hours total battery with wireless Qi charging compact case",
      "IPX7 certified sweat and rain resistant for high-intensity workouts"
    ],
    specs: {
      "Playback": "8 Hours (Earbuds) + 28 Hours (Case)",
      "ANC Level": "-48dB Depth",
      "Waterproof": "IPX7 Rating",
      "Charging": "Wireless Qi + USB-C Quick Charge",
      "Microphones": "6 Mics with AI Call Noise Suppression"
    },
    reviews: [
      { user: "Emma W.", rating: 5, date: "2026-09-05", comment: "Bass is punchy without distorting vocals. Fits securely in gym!" }
    ]
  },
  {
    id: "prod-9",
    name: "OmniCharge 140W GaN Fast Wall Hub",
    tagline: "Power 4 high-demand devices simultaneously at lightning speed",
    category: "Tech & Gadgets",
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.9,
    reviewCount: 1450,
    badge: "ESSENTIAL",
    badgeType: "accent",
    stock: 40,
    colors: ["#334155", "#f8fafc"],
    colorNames: ["Space Graphite", "Pure Arctic"],
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Next-Gen GaN III semiconductor technology runs 30% cooler and 50% smaller",
      "Single port delivers full 140W USB-C PD 3.1 power (charges 16\" MacBook in 30 min)",
      "Intelligent power redistribution across 3x USB-C and 1x USB-A ports",
      "Comprehensive active thermal safeguard monitoring temperature 80x per second"
    ],
    specs: {
      "Total Wattage": "140W Max Output",
      "Ports": "3x USB-C, 1x USB-A",
      "Protocols": "PD 3.1, PPS, QC 4.0, Apple 2.4A",
      "Dimensions": "75 x 75 x 30 mm",
      "Plugs": "Foldable US + UK/EU Adapters Included"
    },
    reviews: [
      { user: "Kevin G.", rating: 5, date: "2026-08-20", comment: "Replaced 4 bulky bricks in my backpack with one sleek device!" }
    ]
  },
  {
    id: "prod-10",
    name: "AeroBreeze Smart HEPA Air Purifier Pro",
    tagline: "Medical H13 filtration capturing 99.97% of airborne dust, allergens & smoke",
    category: "Smart Home",
    price: 219.00,
    originalPrice: 279.00,
    rating: 4.8,
    reviewCount: 780,
    badge: "WELLNESS",
    badgeType: "new",
    stock: 14,
    colors: ["#ffffff", "#cbd5e1"],
    colorNames: ["Alpine White", "Platinum Silver"],
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "3-stage filtration: Pre-filter, true H13 HEPA, and activated carbon pellet bed",
      "Laser air quality sensor displaying real-time PM2.5 and auto-adjusting fan speeds",
      "Ultra-quiet sleep mode operating at whisper quiet 22dB sound level",
      "Covers up to 600 sq ft room with complete air turnover in only 15 minutes"
    ],
    specs: {
      "Coverage": "600 sq ft (56 m²)",
      "CADR": "350 m³/h",
      "Noise Level": "22dB - 50dB",
      "Smart Control": "Wi-Fi App / Alexa / Google Home",
      "Filter Life": "6-8 Months with in-app reminder"
    },
    reviews: [
      { user: "Samantha K.", rating: 5, date: "2026-09-14", comment: "My allergies cleared up within 24 hours of turning this on in bedroom." }
    ]
  },
  {
    id: "prod-11",
    name: "TerraFit Smart UV Self-Cleaning Thermal Bottle",
    tagline: "Double-wall vacuum insulation with integrated UV-C purification lid",
    category: "Fashion & Apparel",
    price: 44.99,
    originalPrice: 55.00,
    rating: 4.6,
    reviewCount: 910,
    badge: "ECO FRIENDLY",
    badgeType: "accent",
    stock: 60,
    colors: ["#06b6d4", "#ec4899", "#1e293b", "#059669"],
    colorNames: ["Teal Cyan", "Electric Magenta", "Carbon Slate", "Emerald Green"],
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "UV-C LED cap sanitizes water and bottle interior in 60 seconds with 99.9% efficacy",
      "Cap touch OLED display shows liquid temperature in real time",
      "Keeps ice cold for 24 hours or piping hot for 12 hours without external sweat",
      "Rechargeable magnetic USB cap lasts 30 days on a single charge"
    ],
    specs: {
      "Capacity": "750ml (25 oz)",
      "Material": "18/8 Pro-Grade Stainless Steel (BPA Free)",
      "Insulation": "Double-Wall Copper Vacuum",
      "Purification": "280nm UV-C LED",
      "Weight": "380g Empty"
    },
    reviews: [
      { user: "Jordan P.", rating: 5, date: "2026-08-11", comment: "No stinky water bottle smell ever again! Love the temperature display." }
    ]
  },
  {
    id: "prod-12",
    name: "HyperGlide 4K Waterproof Action Camera",
    tagline: "Smooth 6-axis gyro stabilization, dual touchscreens, 4K60fps HDR video",
    category: "Tech & Gadgets",
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviewCount: 460,
    badge: "ADVENTURE",
    badgeType: "hot",
    stock: 21,
    colors: ["#18181b", "#ea580c"],
    colorNames: ["Stealth Black", "Summit Orange"],
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Crisp 4K at 60fps and 20MP photos with ultra-wide 170° distortion-corrected lens",
      "HyperSmooth 4.0 algorithmic gimbal-like stabilization for rugged action",
      "Dual responsive color touchscreens (front selfie screen + 2.2\" rear touch display)",
      "Native waterproof to 14m without housing (up to 40m with included dive case)"
    ],
    specs: {
      "Video Quality": "4K@60fps, 2.7K@120fps, 1080p@240fps slow-mo",
      "Photo Resolution": "20 Megapixels RAW/JPG",
      "Stabilization": "6-Axis Electronic Gyro + Horizon Lock",
      "Battery": "Dual 1350mAh packs (up to 180 min recording)",
      "Connectivity": "High-Speed Wi-Fi, Micro-HDMI, USB-C"
    },
    reviews: [
      { user: "Derrick N.", rating: 5, date: "2026-09-22", comment: "Used for mountain biking downhill, footage is butter smooth. Exceptional value." }
    ]
  }
];

// Helper functions for reading/writing JSON files
function readJSON(file, defaultValue = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultValue;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Initialize database files with seed data
function initDatabase() {
  if (!fs.existsSync(PRODUCTS_FILE) || readJSON(PRODUCTS_FILE, []).length === 0) {
    writeJSON(PRODUCTS_FILE, INITIAL_PRODUCTS);
    console.log('Seeded products database with 12 items');
  }

  if (!fs.existsSync(USERS_FILE) || readJSON(USERS_FILE, []).length === 0) {
    // Seed default demo user: alex@example.com / password123
    const { hash, salt } = hashPassword('password123');
    const demoUser = {
      id: "usr-" + crypto.randomUUID().slice(0, 8),
      name: "Alex Rivera",
      email: "alex@example.com",
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString(),
      avatar: "AR"
    };
    writeJSON(USERS_FILE, [demoUser]);
    console.log('Seeded users database with demo user (alex@example.com / password123)');
  }

  if (!fs.existsSync(ORDERS_FILE) || readJSON(ORDERS_FILE, []).length === 0) {
    // Sample initial completed order for demo user
    const users = readJSON(USERS_FILE, []);
    const demoUser = users[0] || { id: "usr-demo", name: "Alex Rivera", email: "alex@example.com" };
    const sampleOrder = {
      id: "ORD-84920",
      userId: demoUser.id,
      customer: {
        name: demoUser.name,
        email: demoUser.email,
        phone: "+1 (555) 382-9912",
        address: "742 Evergreen Terrace, Suite 4B",
        city: "San Francisco",
        state: "CA",
        postalCode: "94107",
        country: "United States"
      },
      items: [
        {
          id: "prod-1",
          name: "NovaSound Apex Wireless ANC Headphones",
          color: "Midnight Black",
          price: 249.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
        }
      ],
      pricing: {
        subtotal: 249.99,
        shipping: 0.00,
        discount: 25.00,
        tax: 18.00,
        total: 242.99
      },
      paymentMethod: "Credit Card (ending 4242)",
      paymentStatus: "Paid",
      orderStatus: "Delivered",
      trackingSteps: [
        { step: "Order Placed", date: "2026-09-20 10:15 AM", done: true },
        { step: "Processing & Quality Check", date: "2026-09-20 02:40 PM", done: true },
        { step: "Shipped via FedEx Express", date: "2026-09-21 09:30 AM", done: true },
        { step: "Delivered", date: "2026-09-23 03:15 PM", done: true }
      ],
      createdAt: "2026-09-20T10:15:00.000Z"
    };
    writeJSON(ORDERS_FILE, [sampleOrder]);
    console.log('Seeded orders database with sample order ORD-84920');
  }
}

// Database Operations API
const db = {
  init: initDatabase,

  // Products
  getProducts: (filters = {}) => {
    let products = readJSON(PRODUCTS_FILE, []);
    
    if (filters.category && filters.category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice) {
      products = products.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default: // featured
          break;
      }
    }

    return products;
  },

  getProductById: (id) => {
    const products = readJSON(PRODUCTS_FILE, []);
    return products.find(p => p.id === id) || null;
  },

  getCategories: () => {
    const products = readJSON(PRODUCTS_FILE, []);
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    return Object.keys(categoryCounts).map(name => ({
      name,
      count: categoryCounts[name]
    }));
  },

  // Users & Auth
  findUserByEmail: (email) => {
    const users = readJSON(USERS_FILE, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: (id) => {
    const users = readJSON(USERS_FILE, []);
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, salt, ...safeUser } = user;
    return safeUser;
  },

  createUser: ({ name, email, password }) => {
    const users = readJSON(USERS_FILE, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('A user with this email address already exists');
    }

    const { hash, salt } = hashPassword(password);
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    const newUser = {
      id: "usr-" + crypto.randomUUID().slice(0, 8),
      name,
      email,
      passwordHash: hash,
      salt: salt,
      avatar: initials,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  },

  validateLogin: (email, password) => {
    const users = readJSON(USERS_FILE, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) return null;

    const { passwordHash, salt, ...safeUser } = user;
    return safeUser;
  },

  // Orders
  getOrders: (userId = null, userEmail = null) => {
    const orders = readJSON(ORDERS_FILE, []);
    if (userId || userEmail) {
      return orders.filter(o => 
        (userId && o.userId === userId) ||
        (userEmail && o.customer && o.customer.email && o.customer.email.toLowerCase() === userEmail.toLowerCase())
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById: (orderId) => {
    const orders = readJSON(ORDERS_FILE, []);
    const cleanId = (orderId || '').trim().toUpperCase();
    return orders.find(o => 
      (o.id && o.id.toUpperCase() === cleanId) || 
      (o.trackingNumber && o.trackingNumber.toUpperCase() === cleanId)
    ) || null;
  },

  createOrder: ({ userId, customer, items, pricing, paymentMethod }) => {
    const orders = readJSON(ORDERS_FILE, []);
    const products = readJSON(PRODUCTS_FILE, []);

    // Create unique order ID like ORD-68291
    const orderNumber = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const timeline = [
      {
        title: "Order Placed & Payment Confirmed",
        step: "Order Placed & Payment Confirmed",
        time: `${dateFormatted}, ${timeFormatted}`,
        date: `${dateFormatted}, ${timeFormatted}`,
        hub: "Aura Logistics Bengaluru Central Hub",
        location: "Bengaluru Hub",
        done: true
      },
      {
        title: "Quality Check & Shockproof Sealed Packaging",
        step: "Quality Inspection & Packaging",
        time: "In Progress",
        date: "In Progress",
        hub: "Aura Fulfillment Depot, Hosur Rd",
        location: "Aura Fulfillment Depot",
        done: true
      },
      {
        title: "Dispatched via Express Air Cargo",
        step: "Dispatched via Air Cargo",
        time: "Expected Tomorrow, 06:00 AM",
        date: "Expected Tomorrow, 06:00 AM",
        hub: "Kempegowda Int'l Cargo Terminal",
        location: "Kempegowda Airport Hub",
        done: false
      },
      {
        title: "Arrived at Destination City Logistics Center",
        step: "Arrived at City Sorting Center",
        time: "Expected in 1-2 Days",
        date: "Expected in 1-2 Days",
        hub: `${customer.city || "Bengaluru"} Logistics Station`,
        location: `${customer.city || "Bengaluru"} Hub`,
        done: false
      },
      {
        title: "Delivered to Doorstep with OTP Verification",
        step: "Delivered to Doorstep with OTP",
        time: "Expected in 2-3 Days",
        date: "Expected in 2-3 Days",
        hub: customer.address || "Customer Address",
        location: customer.address || "Customer Address",
        done: false
      }
    ];

    const newOrder = {
      id: orderNumber,
      userId: userId || null,
      customer,
      items,
      pricing,
      paymentMethod: paymentMethod || 'UPI (Google Pay / PhonePe)',
      paymentStatus: "Paid",
      orderStatus: "In Transit",
      status: "In Transit",
      carrier: "BlueDart Express Air",
      trackingNumber: "BD-IN-" + Math.floor(10000000 + Math.random() * 90000000),
      expectedDelivery: "Expected in 1-2 Days",
      steps: timeline,
      trackingSteps: timeline,
      createdAt: now.toISOString()
    };

    // Deduct stock
    items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod && prod.stock >= item.quantity) {
        prod.stock -= item.quantity;
      }
    });
    writeJSON(PRODUCTS_FILE, products);

    orders.unshift(newOrder);
    writeJSON(ORDERS_FILE, orders);
    return newOrder;
  }
};

module.exports = db;
