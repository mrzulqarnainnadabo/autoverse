export type CarCondition = "Tokunbo" | "Foreign Used" | "Brand New" | "Nigerian Used";

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: CarCondition;
  location: string;
  state: string;
  mileage: number;
  color: string;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Diesel" | "Hybrid";
  localImage: "car1" | "car2" | null;
  dealerName: string;
  dealerPhone: string;
  dealerRating: number;
  dealerReviews: number;
  verified: boolean;
  aiInspected: boolean;
  conditionScore: number | null;
  trustBadge: "AI Verified" | "Caution Advised" | "High Risk" | null;
  featured: boolean;
  description: string;
  engine: string;
  seats: number;
  views: number;
  postedAt: string;
}

export const MOCK_CARS: Car[] = [
  {
    id: "1",
    make: "Lexus",
    model: "ES 350",
    year: 2021,
    price: 38,
    condition: "Tokunbo",
    location: "Lekki, Lagos",
    state: "Lagos",
    mileage: 34000,
    color: "Obsidian Black",
    transmission: "Automatic",
    fuelType: "Petrol",
    localImage: "car1",
    dealerName: "Yusuf Motors",
    dealerPhone: "+2348036984766",
    dealerRating: 4.8,
    dealerReviews: 127,
    verified: true,
    aiInspected: true,
    conditionScore: 92,
    trustBadge: "AI Verified",
    featured: true,
    description:
      "2021 Lexus ES 350 in perfect condition. Single owner, full service history. Clean title, no accidents. Imported from Canada. Panoramic sunroof, heated & ventilated seats, 12-inch touchscreen with Apple CarPlay.",
    engine: "3.5L V6 302hp",
    seats: 5,
    views: 423,
    postedAt: "2 days ago",
  },
  {
    id: "2",
    make: "BMW",
    model: "X5 xDrive40i",
    year: 2020,
    price: 55,
    condition: "Foreign Used",
    location: "Wuse 2, Abuja",
    state: "Abuja",
    mileage: 48000,
    color: "Phytonic Blue",
    transmission: "Automatic",
    fuelType: "Petrol",
    localImage: "car2",
    dealerName: "Premium Auto Abuja",
    dealerPhone: "+2348051234567",
    dealerRating: 4.6,
    dealerReviews: 89,
    verified: true,
    aiInspected: true,
    conditionScore: 88,
    trustBadge: "AI Verified",
    featured: true,
    description:
      "2020 BMW X5 xDrive40i M Sport package. Imported from USA with clean title. Full panoramic roof, Harman Kardon sound system, 360-degree cameras, wireless charging, and premium leather interior.",
    engine: "3.0L Turbocharged I6 335hp",
    seats: 7,
    views: 687,
    postedAt: "5 days ago",
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "GLE 450",
    year: 2019,
    price: 68,
    condition: "Foreign Used",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    mileage: 62000,
    color: "Designo Selenite Grey",
    transmission: "Automatic",
    fuelType: "Petrol",
    localImage: null,
    dealerName: "Star Motors NG",
    dealerPhone: "+2347012345678",
    dealerRating: 4.9,
    dealerReviews: 203,
    verified: true,
    aiInspected: false,
    conditionScore: null,
    trustBadge: null,
    featured: false,
    description:
      "Rare 2019 Mercedes GLE 450 4MATIC in showroom condition. COMAND Online system, Burmester surround sound, AIR BODY CONTROL suspension. Full service records.",
    engine: "3.0L Turbocharged I6 362hp",
    seats: 7,
    views: 312,
    postedAt: "1 week ago",
  },
  {
    id: "4",
    make: "Toyota",
    model: "Camry XSE",
    year: 2022,
    price: 28,
    condition: "Brand New",
    location: "Port Harcourt",
    state: "Rivers",
    mileage: 0,
    color: "Wind Chill Pearl",
    transmission: "Automatic",
    fuelType: "Petrol",
    localImage: null,
    dealerName: "City Toyota PH",
    dealerPhone: "+2348099876543",
    dealerRating: 4.5,
    dealerReviews: 56,
    verified: true,
    aiInspected: false,
    conditionScore: null,
    trustBadge: null,
    featured: false,
    description:
      "Brand new 2022 Toyota Camry XSE. Still in transit from Japan. V6 engine with sport-tuned suspension. Wireless Apple CarPlay & Android Auto, 9-inch multimedia display.",
    engine: "3.5L V6 301hp",
    seats: 5,
    views: 198,
    postedAt: "3 days ago",
  },
  {
    id: "5",
    make: "Range Rover",
    model: "Sport HSE",
    year: 2018,
    price: 85,
    condition: "Tokunbo",
    location: "Ikoyi, Lagos",
    state: "Lagos",
    mileage: 71000,
    color: "Santorini Black",
    transmission: "Automatic",
    fuelType: "Diesel",
    localImage: null,
    dealerName: "Luxe Rides Lagos",
    dealerPhone: "+2348023456789",
    dealerRating: 4.7,
    dealerReviews: 178,
    verified: true,
    aiInspected: true,
    conditionScore: 85,
    trustBadge: "AI Verified",
    featured: false,
    description:
      "2018 Range Rover Sport HSE Dynamic. Air suspension, Terrain Response 2, Meridian Sound System, 360° surround camera. Full UK spec, imported with all documents.",
    engine: "3.0L TDV6 306hp",
    seats: 5,
    views: 540,
    postedAt: "4 days ago",
  },
  {
    id: "6",
    make: "Toyota",
    model: "Land Cruiser Prado TX",
    year: 2023,
    price: 95,
    condition: "Brand New",
    location: "Ikeja, Lagos",
    state: "Lagos",
    mileage: 0,
    color: "Nardo Grey",
    transmission: "Automatic",
    fuelType: "Diesel",
    localImage: null,
    dealerName: "Toyota Nigeria Ltd",
    dealerPhone: "+2348034567890",
    dealerRating: 4.8,
    dealerReviews: 92,
    verified: true,
    aiInspected: false,
    conditionScore: null,
    trustBadge: null,
    featured: false,
    description:
      "2023 Toyota Prado TX. Factory fresh from Japan. Diesel engine perfect for Nigerian roads. Multi-terrain select, crawl control, 360° cameras, dual-zone climate.",
    engine: "2.8L Diesel 201hp",
    seats: 8,
    views: 876,
    postedAt: "1 day ago",
  },
];

export interface Conversation {
  id: string;
  name: string;
  carTitle: string;
  lastMessage: string;
  time: string;
  unread: number;
  initials: string;
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Ahmed Okafor",
    carTitle: "2021 Lexus ES 350",
    lastMessage: "Is the price negotiable? I can offer ₦36M",
    time: "2m ago",
    unread: 2,
    initials: "AO",
  },
  {
    id: "c2",
    name: "Fatima Bello",
    carTitle: "2020 BMW X5",
    lastMessage: "Can I come for a test drive tomorrow morning?",
    time: "1h ago",
    unread: 1,
    initials: "FB",
  },
  {
    id: "c3",
    name: "Chukwuemeka Eze",
    carTitle: "2022 Toyota Camry",
    lastMessage: "Sent the inspection report. Please review.",
    time: "3h ago",
    unread: 0,
    initials: "CE",
  },
  {
    id: "c4",
    name: "Halima Sani",
    carTitle: "2018 Range Rover Sport",
    lastMessage: "Thank you for the details!",
    time: "Yesterday",
    unread: 0,
    initials: "HS",
  },
];
