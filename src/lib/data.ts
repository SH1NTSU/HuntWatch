// ============================================================
// HuntWatch — Mock Data & Types
// ============================================================

// ---- Types ----
export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  workplace: string;
  ageGroup: string;
  greenScore: number;
  weeklyScore: number;
  streak: number;
  rank: number;
  totalMembers: number;
  joinedDate: string;
  treesEquivalent: number;
  co2Saved: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  change: number; // +/- from last week
  location?: string;
  workplace?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  community: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  participants: number;
  joined: boolean;
  category: "products" | "transport" | "energy" | "food" | "waste";
}

export interface Pledge {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  pledge: string;
  brand?: string;
  startDate: string;
  daysKept: number;
  totalDays: number;
  isActive: boolean;
  supporters: number;
  category: string;
}

export interface ProductScan {
  id: string;
  name: string;
  brand: string;
  sustainabilityScore: number; // 0-100
  deforestationRisk: "low" | "medium" | "high";
  palmOilFree: boolean;
  certifications: string[];
  alternatives: string[];
  imageUrl?: string;
}

export interface ImpactData {
  month: string;
  yourImpact: number;
  neighborAvg: number;
  cityAvg: number;
}

export interface DeforestationReport {
  id: string;
  userId: string;
  userName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  date: string;
  status: "pending" | "verified" | "investigating";
  upvotes: number;
  imageUrl?: string;
}

export interface VolunteerEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  spotsLeft: number;
  totalSpots: number;
  scoreReward: number;
  category: string;
  organizer: string;
  joined: boolean;
}

export interface Notification {
  id: string;
  type: "nudge" | "rank_drop" | "streak_break" | "challenge" | "achievement";
  message: string;
  from?: string;
  time: string;
  read: boolean;
}

// ---- Current user ----
export const currentUser: User = {
  id: "u1",
  name: "Aisha Rahman",
  avatar: "AR",
  location: "Petaling Jaya",
  workplace: "TechCorp Malaysia",
  ageGroup: "25-34",
  greenScore: 62,
  weeklyScore: 45,
  streak: 12,
  rank: 847,
  totalMembers: 1200,
  joinedDate: "2024-06-15",
  treesEquivalent: 3.2,
  co2Saved: 48,
};

// ---- Neighborhood leaderboard ----
export const neighborhoodLeaderboard: LeaderboardEntry[] = [
  { id: "l1", name: "Mei Ling Tan", avatar: "MT", score: 94, change: 2, location: "PJ SS2" },
  { id: "l2", name: "Raj Kumar", avatar: "RK", score: 91, change: -1, location: "PJ SS2" },
  { id: "l3", name: "Sarah Lim", avatar: "SL", score: 88, change: 5, location: "PJ SS17" },
  { id: "l4", name: "Ahmad Faiz", avatar: "AF", score: 85, change: 0, location: "PJ SS2" },
  { id: "l5", name: "Priya Nair", avatar: "PN", score: 83, change: 3, location: "PJ SS15" },
  { id: "l6", name: "Jason Wong", avatar: "JW", score: 80, change: -2, location: "PJ SS2" },
  { id: "l7", name: "Fatimah Ali", avatar: "FA", score: 78, change: 1, location: "PJ SS17" },
  { id: "l8", name: "David Chong", avatar: "DC", score: 75, change: -3, location: "PJ SS15" },
  { id: "l9", name: "Nurul Huda", avatar: "NH", score: 72, change: 4, location: "PJ SS2" },
  { id: "l10", name: "Aisha Rahman", avatar: "AR", score: 62, change: -5, location: "PJ SS2" },
  { id: "l11", name: "Vijay Rao", avatar: "VR", score: 58, change: -1, location: "PJ SS15" },
  { id: "l12", name: "Zulkifli Hassan", avatar: "ZH", score: 52, change: -4, location: "PJ SS17" },
];

export const workplaceLeaderboard: LeaderboardEntry[] = [
  { id: "w1", name: "Chen Wei", avatar: "CW", score: 96, change: 1, workplace: "TechCorp" },
  { id: "w2", name: "Ananya Pillai", avatar: "AP", score: 90, change: 3, workplace: "TechCorp" },
  { id: "w3", name: "Marcus Lee", avatar: "ML", score: 87, change: -2, workplace: "TechCorp" },
  { id: "w4", name: "Siti Aminah", avatar: "SA", score: 84, change: 0, workplace: "TechCorp" },
  { id: "w5", name: "Kevin Teh", avatar: "KT", score: 79, change: 2, workplace: "TechCorp" },
  { id: "w6", name: "Aisha Rahman", avatar: "AR", score: 62, change: -5, workplace: "TechCorp" },
  { id: "w7", name: "Bala Subramaniam", avatar: "BS", score: 55, change: -2, workplace: "TechCorp" },
];

export const ageGroupLeaderboard: LeaderboardEntry[] = [
  { id: "a1", name: "Lina Ng", avatar: "LN", score: 95, change: 4 },
  { id: "a2", name: "Hassan Ali", avatar: "HA", score: 92, change: 1 },
  { id: "a3", name: "Mei Fong", avatar: "MF", score: 89, change: -1 },
  { id: "a4", name: "Aisha Rahman", avatar: "AR", score: 62, change: -5 },
  { id: "a5", name: "Tom Lee", avatar: "TL", score: 48, change: -8 },
];

// ---- Challenges ----
export const challenges: Challenge[] = [
  {
    id: "c1",
    title: "500 Sustainable Products Switch",
    description: "Subang Jaya collectively switches to 500 sustainable products this month",
    community: "Subang Jaya",
    target: 500,
    current: 342,
    unit: "products",
    deadline: "2025-02-28",
    participants: 234,
    joined: true,
    category: "products",
  },
  {
    id: "c2",
    title: "Zero Single-Use Plastics Week",
    description: "Petaling Jaya goes one full week without single-use plastics",
    community: "Petaling Jaya",
    target: 1000,
    current: 678,
    unit: "participants",
    deadline: "2025-02-14",
    participants: 678,
    joined: true,
    category: "waste",
  },
  {
    id: "c3",
    title: "Public Transport Month",
    description: "TechCorp employees collectively log 10,000 km of public transport",
    community: "TechCorp Malaysia",
    target: 10000,
    current: 4520,
    unit: "km",
    deadline: "2025-02-28",
    participants: 89,
    joined: false,
    category: "transport",
  },
  {
    id: "c4",
    title: "Meatless Mondays",
    description: "SS2 neighborhood commits to meatless Mondays for a month",
    community: "PJ SS2",
    target: 200,
    current: 156,
    unit: "meals",
    deadline: "2025-02-28",
    participants: 52,
    joined: false,
    category: "food",
  },
  {
    id: "c5",
    title: "Energy Saving Sprint",
    description: "Reduce energy consumption by 20% across Selangor offices",
    community: "Selangor",
    target: 5000,
    current: 2100,
    unit: "kWh saved",
    deadline: "2025-03-15",
    participants: 412,
    joined: true,
    category: "energy",
  },
];

// ---- Pledges ----
export const pledges: Pledge[] = [
  {
    id: "p1",
    userId: "u1",
    userName: "Aisha Rahman",
    userAvatar: "AR",
    pledge: "Avoid all deforestation-linked palm oil brands",
    brand: "Multiple brands",
    startDate: "2025-01-01",
    daysKept: 36,
    totalDays: 90,
    isActive: true,
    supporters: 23,
    category: "Palm Oil",
  },
  {
    id: "p2",
    userId: "u2",
    userName: "Mei Ling Tan",
    userAvatar: "MT",
    pledge: "Only buy RSPO-certified products",
    startDate: "2024-12-01",
    daysKept: 67,
    totalDays: 180,
    isActive: true,
    supporters: 45,
    category: "Products",
  },
  {
    id: "p3",
    userId: "u3",
    userName: "Raj Kumar",
    userAvatar: "RK",
    pledge: "No fast fashion purchases for 6 months",
    brand: "Shein, Zara",
    startDate: "2024-11-15",
    daysKept: 83,
    totalDays: 180,
    isActive: true,
    supporters: 67,
    category: "Fashion",
  },
  {
    id: "p4",
    userId: "u4",
    userName: "Sarah Lim",
    userAvatar: "SL",
    pledge: "Switch to 100% renewable energy provider",
    startDate: "2025-01-15",
    daysKept: 22,
    totalDays: 365,
    isActive: true,
    supporters: 34,
    category: "Energy",
  },
  {
    id: "p5",
    userId: "u5",
    userName: "Ahmad Faiz",
    userAvatar: "AF",
    pledge: "Cycle to work every day",
    startDate: "2025-01-01",
    daysKept: 15,
    totalDays: 30,
    isActive: false,
    supporters: 12,
    category: "Transport",
  },
];

// ---- Products ----
export const sampleProducts: ProductScan[] = [
  {
    id: "pr1",
    name: "Eco-Friendly Dish Soap",
    brand: "GreenClean MY",
    sustainabilityScore: 92,
    deforestationRisk: "low",
    palmOilFree: true,
    certifications: ["RSPO", "EcoCert", "Palm Oil Free"],
    alternatives: [],
  },
  {
    id: "pr2",
    name: "Instant Noodles",
    brand: "PopularBrand",
    sustainabilityScore: 34,
    deforestationRisk: "high",
    palmOilFree: false,
    certifications: [],
    alternatives: ["NatureMie Organic Noodles", "GreenBowl Instant"],
  },
  {
    id: "pr3",
    name: "Chocolate Spread",
    brand: "ChocoDelight",
    sustainabilityScore: 45,
    deforestationRisk: "high",
    palmOilFree: false,
    certifications: [],
    alternatives: ["NutElla Sustainable", "Forest-Free Choco"],
  },
  {
    id: "pr4",
    name: "Bamboo Toothbrush",
    brand: "EcoSmile",
    sustainabilityScore: 95,
    deforestationRisk: "low",
    palmOilFree: true,
    certifications: ["FSC", "B-Corp"],
    alternatives: [],
  },
  {
    id: "pr5",
    name: "Cooking Oil",
    brand: "SawitGold",
    sustainabilityScore: 28,
    deforestationRisk: "high",
    palmOilFree: false,
    certifications: [],
    alternatives: ["RSPO Certified Palm Oil", "Coconut Oil Alternative"],
  },
];

// ---- Impact chart data ----
export const impactData: ImpactData[] = [
  { month: "Aug", yourImpact: 4.5, neighborAvg: 2.1, cityAvg: 3.2 },
  { month: "Sep", yourImpact: 4.2, neighborAvg: 2.0, cityAvg: 3.0 },
  { month: "Oct", yourImpact: 3.8, neighborAvg: 1.8, cityAvg: 2.8 },
  { month: "Nov", yourImpact: 3.5, neighborAvg: 1.5, cityAvg: 2.5 },
  { month: "Dec", yourImpact: 3.4, neighborAvg: 1.2, cityAvg: 2.3 },
  { month: "Jan", yourImpact: 3.2, neighborAvg: 1.0, cityAvg: 2.1 },
];

// ---- Deforestation reports ----
export const deforestationReports: DeforestationReport[] = [
  {
    id: "r1",
    userId: "u7",
    userName: "Lina Ng",
    location: "Near Taman Negara border",
    coordinates: { lat: 4.3833, lng: 102.3833 },
    description: "Illegal logging activity spotted — approximately 2 hectares of old-growth forest cleared",
    date: "2025-01-28",
    status: "investigating",
    upvotes: 89,
  },
  {
    id: "r2",
    userId: "u8",
    userName: "Hassan Ali",
    location: "Perak state, near Gerik",
    coordinates: { lat: 5.4333, lng: 101.1167 },
    description: "New palm oil plantation clearing in protected area buffer zone",
    date: "2025-01-25",
    status: "verified",
    upvotes: 156,
  },
  {
    id: "r3",
    userId: "u9",
    userName: "Vijay Rao",
    location: "Sabah, near Danum Valley",
    coordinates: { lat: 5.0, lng: 117.8 },
    description: "Suspicious clearing activity near wildlife corridor",
    date: "2025-02-01",
    status: "pending",
    upvotes: 34,
  },
];

// ---- Volunteer events ----
export const volunteerEvents: VolunteerEvent[] = [
  {
    id: "v1",
    title: "Mangrove Planting Day",
    description: "Join us to plant 500 mangrove saplings along the Klang coastline. All materials provided.",
    location: "Port Klang, Selangor",
    date: "2025-02-15",
    time: "8:00 AM - 12:00 PM",
    spotsLeft: 23,
    totalSpots: 100,
    scoreReward: 15,
    category: "Planting",
    organizer: "Malaysian Nature Society",
    joined: false,
  },
  {
    id: "v2",
    title: "River Cleanup: Sungai Klang",
    description: "Monthly river cleanup drive. Help remove waste and restore our waterways.",
    location: "Sungai Klang, KL",
    date: "2025-02-22",
    time: "7:00 AM - 11:00 AM",
    spotsLeft: 45,
    totalSpots: 80,
    scoreReward: 12,
    category: "Cleanup",
    organizer: "River Rangers MY",
    joined: true,
  },
  {
    id: "v3",
    title: "Sustainable Living Workshop",
    description: "Learn to make your own sustainable products — soap, detergent, and more.",
    location: "Community Hall, PJ SS2",
    date: "2025-03-01",
    time: "2:00 PM - 5:00 PM",
    spotsLeft: 12,
    totalSpots: 30,
    scoreReward: 8,
    category: "Education",
    organizer: "Green Living MY",
    joined: false,
  },
  {
    id: "v4",
    title: "Wildlife Survey: Taman Negara",
    description: "Assist researchers in documenting wildlife in Taman Negara. 3-day expedition.",
    location: "Taman Negara, Pahang",
    date: "2025-03-15",
    time: "Full Day",
    spotsLeft: 5,
    totalSpots: 15,
    scoreReward: 25,
    category: "Research",
    organizer: "WWF Malaysia",
    joined: false,
  },
];

// ---- Notifications ----
export const notifications: Notification[] = [
  {
    id: "n1",
    type: "nudge",
    message: "Mei Ling nudged you — your score dropped 5 points this week! 💚",
    from: "Mei Ling Tan",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "rank_drop",
    message: "You dropped from #8 to #10 in Petaling Jaya rankings",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "challenge",
    message: "Subang Jaya's '500 Sustainable Products' challenge is 68% complete!",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    type: "streak_break",
    message: "Ahmad Faiz broke his cycling streak after 15 days",
    from: "Ahmad Faiz",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "achievement",
    message: "You've logged 12 days in a row! Keep the streak alive 🔥",
    time: "3 days ago",
    read: true,
  },
];

// ---- Social pressure stats ----
export const socialPressureStats = {
  betterThanYou: 82,
  location: "Petaling Jaya",
  ageGroupSwitch: 94,
  ageGroup: "25-34",
  palmOilSwitchPercentage: 94,
  extinctionYear: 2031,
  animalName: "Malayan tiger",
  neighborTreesLost: 0.5,
  yourTreesLost: 3.2,
};
