export interface AgriStackFarmerProfile {
  name: string;
  land: string;
  block: string;
  agriStackId: string;
  stateCode: string;
  mandis: string[];
  crop: string;
  acreage: number;
  weight: string;
}

export const AGRISTACK_FARMER_DATASET: AgriStackFarmerProfile[] = [
  {
    name: 'Rameshwar Mondal',
    land: '3.2 Acres',
    acreage: 3.2,
    block: 'Burdwan II (WB)',
    agriStackId: 'AS-WB-8762',
    stateCode: 'WB',
    crop: 'Wheat (HD-2967)',
    weight: '28 Quintals (56 Bags)',
    mandis: ['Burdwan Central APMC', 'Kalna Regulated Market', 'Memari Mandi'],
  },
  {
    name: 'Harpreet Singh Gill',
    land: '6.5 Acres',
    acreage: 6.5,
    block: 'Ludhiana West (PB)',
    agriStackId: 'AS-PB-1194',
    stateCode: 'PB',
    crop: 'Paddy (PR-126)',
    weight: '54 Quintals (108 Bags)',
    mandis: ["Khanna Grain Market (Asia's Largest)", 'Ludhiana APMC Yard', 'Bhagta Bhai Ka Mandi'],
  },
  {
    name: 'Devendra Patel',
    land: '4.1 Acres',
    acreage: 4.1,
    block: 'Anand Central (GJ)',
    agriStackId: 'AS-GJ-4421',
    stateCode: 'GJ',
    crop: 'Castor Seeds',
    weight: '32 Quintals (64 Bags)',
    mandis: ['Anand Main APMC', 'Petlad APMC Yard'],
  },
  {
    name: 'Subhash Yadav',
    land: '2.8 Acres',
    acreage: 2.8,
    block: 'Varanasi Sadar (UP)',
    agriStackId: 'AS-UP-9083',
    stateCode: 'UP',
    crop: 'Mustard (Pusa Bold)',
    weight: '22 Quintals (44 Bags)',
    mandis: ['Varanasi Mandi Samiti (Panchkoshi)', 'Chandauli Grain Mandi'],
  },
  {
    name: 'Manjunath Gowda',
    land: '5.0 Acres',
    acreage: 5.0,
    block: 'Mandya North (KA)',
    agriStackId: 'AS-KA-3310',
    stateCode: 'KA',
    crop: 'Ragi (Indaf-8)',
    weight: '39 Quintals (78 Bags)',
    mandis: ['Mandya APMC Market', 'Maddur Jaggery & Grain Yard'],
  },
  {
    name: 'Dnyaneshwar Shinde',
    land: '4.7 Acres',
    acreage: 4.7,
    block: 'Nashik Rural (MH)',
    agriStackId: 'AS-MH-5529',
    stateCode: 'MH',
    crop: 'Soybean (JS-335)',
    weight: '36 Quintals (72 Bags)',
    mandis: ['Lasalgaon APMC (Onion Hub)', 'Nashik Dindori Mandi'],
  },
  {
    name: 'Sanjay Kumar Meena',
    land: '3.8 Acres',
    acreage: 3.8,
    block: 'Alwar South (RJ)',
    agriStackId: 'AS-RJ-7814',
    stateCode: 'RJ',
    crop: 'Bajra (Hybrid)',
    weight: '30 Quintals (60 Bags)',
    mandis: ['Alwar Krishi Upaj Mandi', 'Khairthal Mandi'],
  },
  {
    name: 'Anupama Roy',
    land: '1.9 Acres',
    acreage: 1.9,
    block: 'Hooghly Sadar (WB)',
    agriStackId: 'AS-WB-6021',
    stateCode: 'WB',
    crop: 'Jute (TD-5)',
    weight: '15 Quintals (30 Bags)',
    mandis: ['Memari Mandi', 'Kalna Regulated Market', 'Burdwan Central APMC'],
  },
  {
    name: 'Muthuvel Karuppasamy',
    land: '3.5 Acres',
    acreage: 3.5,
    block: 'Madurai East (TN)',
    agriStackId: 'AS-TN-4155',
    stateCode: 'TN',
    crop: 'Paddy (Ponni)',
    weight: '29 Quintals (58 Bags)',
    mandis: ['Madurai Mattuthavani Market Yard', 'Usilampatti APMC'],
  },
  {
    name: 'Bikramjeet Barman',
    land: '2.4 Acres',
    acreage: 2.4,
    block: 'Kamrup Metro (AS)',
    agriStackId: 'AS-AS-8812',
    stateCode: 'AS',
    crop: 'Black Gram (Urad)',
    weight: '18 Quintals (36 Bags)',
    mandis: ['Guwahati Pamohi Market Yard'],
  },
  {
    name: 'Raghavendra Rao',
    land: '5.8 Acres',
    acreage: 5.8,
    block: 'Guntur Rural (AP)',
    agriStackId: 'AS-AP-2904',
    stateCode: 'AP',
    crop: 'Chillies (Guntur Sannam)',
    weight: '42 Quintals (84 Bags)',
    mandis: ['Guntur Mirchi Yard', 'Tenali Grain Market'],
  },
  {
    name: 'Surendra Choudhary',
    land: '4.3 Acres',
    acreage: 4.3,
    block: 'Muzaffarpur West (BR)',
    agriStackId: 'AS-BR-7160',
    stateCode: 'BR',
    crop: 'Maize (Hybrid)',
    weight: '35 Quintals (70 Bags)',
    mandis: ['Muzaffarpur Krishi Bazaar Samiti'],
  },
  {
    name: 'Om Prakash Sahu',
    land: '3.1 Acres',
    acreage: 3.1,
    block: 'Raipur Sadar (CG)',
    agriStackId: 'AS-CG-5192',
    stateCode: 'CG',
    crop: 'Paddy (Swarna)',
    weight: '25 Quintals (50 Bags)',
    mandis: ['Raipur Dumartarai APMC Yard'],
  },
  {
    name: 'Balwinder Kaur',
    land: '7.2 Acres',
    acreage: 7.2,
    block: 'Bathinda North (PB)',
    agriStackId: 'AS-PB-3487',
    stateCode: 'PB',
    crop: 'Wheat (PBW-550)',
    weight: '62 Quintals (124 Bags)',
    mandis: ['Bhagta Bhai Ka Mandi', "Khanna Grain Market (Asia's Largest)", 'Ludhiana APMC Yard'],
  },
  {
    name: 'Dilip Mahato',
    land: '2.1 Acres',
    acreage: 2.1,
    block: 'Purulia Central (WB)',
    agriStackId: 'AS-WB-9340',
    stateCode: 'WB',
    crop: 'Potato (Jyoti)',
    weight: '40 Quintals (80 Bags)',
    mandis: ['Burdwan Central APMC', 'Kalna Regulated Market', 'Memari Mandi'],
  },
];

/**
 * Resolves an AgriStack farmer profile dynamically.
 * Either matches direct ID / substring, or computes a deterministic hash
 * across the 15 profiles, or picks uniformly at random if input is empty.
 */
export function lookupAgriStackProfile(input?: string): AgriStackFarmerProfile {
  if (!input || !input.trim()) {
    const randIdx = Math.floor(Math.random() * AGRISTACK_FARMER_DATASET.length);
    return AGRISTACK_FARMER_DATASET[randIdx];
  }

  const clean = input.trim();
  const upper = clean.toUpperCase();

  // 1. Direct match on ID or name
  const exactMatch = AGRISTACK_FARMER_DATASET.find(
    (p) =>
      p.agriStackId.toUpperCase() === upper ||
      p.agriStackId.toUpperCase().replace(/-/g, '') === upper.replace(/-/g, '') ||
      p.name.toUpperCase() === upper
  );
  if (exactMatch) return exactMatch;

  // 2. Partial match on numeric code in ID (e.g. "8762" or "1194")
  const numMatches = upper.replace(/\D/g, '');
  if (numMatches.length >= 4) {
    const codeMatch = AGRISTACK_FARMER_DATASET.find((p) => p.agriStackId.includes(numMatches));
    if (codeMatch) return codeMatch;
  }

  // 3. Deterministic hash distribution across the 15 profiles
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  const index = hash % AGRISTACK_FARMER_DATASET.length;
  return AGRISTACK_FARMER_DATASET[index];
}

/**
 * Returns a random intake profile from the 15-profile pool.
 */
export function getRandomIntakeProfile(): AgriStackFarmerProfile {
  const index = Math.floor(Math.random() * AGRISTACK_FARMER_DATASET.length);
  return AGRISTACK_FARMER_DATASET[index];
}
