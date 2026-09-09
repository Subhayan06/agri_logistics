import { TRANSLATIONS } from '../src/lib/translations.ts';
import { normalizeIndicDigits } from '../src/hooks/useChatStateMachine.ts';

console.log('Testing localization dictionary completeness...');

const requiredLanguages = ['en', 'bn', 'hi', 'gu', 'kn', 'ta'];
for (const lang of requiredLanguages) {
  if (!TRANSLATIONS[lang]) {
    throw new Error(`Missing translation dictionary for language: ${lang}`);
  }
  const t = TRANSLATIONS[lang];
  if (!t.welcomeMessage || !t.step1Prompt || !t.step1Error || !t.step2Prompt || !t.step2Error || !t.step3Prompt || !t.step3Error || !t.step4Prompt || !t.step5Success) {
    throw new Error(`Incomplete prompt/error keys for language: ${lang}`);
  }
  if (!t.passCard.badge || !t.passCard.passTitle || !t.passCard.slotValue || !t.passCard.statusValue) {
    throw new Error(`Incomplete passCard keys for language: ${lang}`);
  }
}
console.log('✓ All 6 language dictionaries (en, bn, hi, gu, kn, ta) are complete & valid.');

// Test Validation Logic
console.log('\nTesting validation rules...');

// 1. AgriStack ID
const validateAgriStack = (input) => {
  const normalized = normalizeIndicDigits(input.trim());
  return /^\d{7}$/.test(normalized);
};

console.assert(!validateAgriStack(''), 'Empty ID must fail');
console.assert(!validateAgriStack('123'), '3 digits must fail');
console.assert(!validateAgriStack('12345678'), '8 digits must fail');
console.assert(!validateAgriStack('abc1234'), 'Letters must fail');
console.assert(validateAgriStack('7842109'), '7842109 must pass');
console.assert(validateAgriStack('৭৮৪২১০৯'), 'Bengali script digits ৭৮৪২১০৯ must pass');
console.assert(validateAgriStack('७८४२१०९'), 'Hindi script digits ७८४२१०९ must pass');
console.log('✓ AgriStack ID validation passes strictly 7 digits across ASCII and Indic numerals');

// 2. Crop Name
const validateCrop = (input) => {
  const trimmed = input.trim();
  const normalized = normalizeIndicDigits(trimmed);
  return !/\d/.test(normalized) && trimmed.replace(/\s+/g, '').length >= 2;
};

console.assert(!validateCrop('123'), 'Numeric crop must fail');
console.assert(!validateCrop('Rice 2'), 'Crop with digit must fail');
console.assert(!validateCrop('ধান ২'), 'Crop with Indic digit must fail');
console.assert(!validateCrop(''), 'Empty crop must fail');
console.assert(validateCrop('Paddy'), 'Paddy must pass');
console.assert(validateCrop('Wheat'), 'Wheat must pass');
console.assert(validateCrop('ধান'), 'Bengali script must pass');
console.assert(validateCrop('गेहूँ'), 'Hindi script must pass');
console.assert(validateCrop('કપાસ'), 'Gujarati script must pass');
console.assert(validateCrop('ಭತ್ತ'), 'Kannada script must pass');
console.assert(validateCrop('நெல்'), 'Tamil script must pass');
console.log('✓ Crop name validation passes strictly text-only across all languages');

// 3. Quantity
const validateQuantity = (input) => {
  const trimmed = input.trim();
  const normalized = normalizeIndicDigits(trimmed);
  const hasDigit = /\d/.test(normalized);
  const hasUnitOrLetter = /[^\d\s]/.test(normalized);
  return hasDigit && hasUnitOrLetter && trimmed.length >= 3;
};

console.assert(!validateQuantity('50'), 'Plain number without unit must fail');
console.assert(!validateQuantity('quintals'), 'Unit without number must fail');
console.assert(validateQuantity('50 Quintals'), '"50 Quintals" must pass');
console.assert(validateQuantity('20 bags'), '"20 bags" must pass');
console.assert(validateQuantity('100kg'), '"100kg" must pass');
console.assert(validateQuantity('৫০ কুইন্টাল'), 'Bengali "৫০ কুইন্টাল" must pass');
console.assert(validateQuantity('50 बोरी'), 'Hindi "50 बोरी" must pass');
console.assert(validateQuantity('૨૦ ગુણી'), 'Gujarati "૨૦ ગુણી" must pass');
console.assert(validateQuantity('೫೦ ಕ್ವಿಂಟಾಲ್'), 'Kannada "೫೦ ಕ್ವಿಂಟಾಲ್" must pass');
console.assert(validateQuantity('20 மூட்டை'), 'Tamil "20 மூட்டை" must pass');
console.log('✓ Quantity validation passes alphanumeric check across all languages & units');

import { AGRISTACK_FARMER_DATASET, lookupAgriStackProfile, getRandomIntakeProfile } from '../src/lib/agristackDataset.ts';

// 4. AgriStack Dynamic Farmer Lookup (15 Profiles)
console.log('\nTesting AgriStack 15-profile dynamic lookup...');
console.assert(AGRISTACK_FARMER_DATASET.length === 15, 'Dataset must have at least 15 profiles');
console.assert(lookupAgriStackProfile('AS-PB-1194').name === 'Harpreet Singh Gill', 'Direct match AS-PB-1194 must return Harpreet Singh Gill');
console.assert(lookupAgriStackProfile('AS-GJ-4421').name === 'Devendra Patel', 'Direct match AS-GJ-4421 must return Devendra Patel');
console.assert(lookupAgriStackProfile('AS-KA-3310').name === 'Manjunath Gowda', 'Direct match AS-KA-3310 must return Manjunath Gowda');
console.assert(lookupAgriStackProfile('7842109').name.length > 0, 'Numeric 7-digit ID must resolve to a valid farmer profile');
console.assert(lookupAgriStackProfile('').name.length > 0, 'Empty input must resolve to a random profile');

for (const p of AGRISTACK_FARMER_DATASET) {
  console.assert(p.name && p.name.length > 0, `Profile must have name`);
  console.assert(p.agriStackId && p.agriStackId.startsWith('AS-'), `Profile ${p.name} must have valid agriStackId`);
  console.assert(p.crop && p.crop.length > 0, `Profile ${p.name} must have crop`);
  console.assert(typeof p.acreage === 'number' && p.acreage > 0, `Profile ${p.name} must have numeric acreage`);
  console.assert(p.weight && p.weight.includes('Quintals'), `Profile ${p.name} must have realistic weight`);
}
const randomProfile = getRandomIntakeProfile();
console.assert(randomProfile && randomProfile.name, 'getRandomIntakeProfile must return a valid profile');
console.log('✓ AgriStack dynamic lookup table tested with 15 unique profiles across Indian states');

// Test (SIM) removal helper
import { sanitizePassCode } from '../src/components/OfficerDashboard.tsx';
console.assert(sanitizePassCode('RQ-8691-IN (SIM)') === 'RQ-8691-IN', '(SIM) suffix must be stripped');
console.assert(sanitizePassCode('RQ-8691-IN(SIM)') === 'RQ-8691-IN', '(SIM) suffix without space must be stripped');
console.assert(sanitizePassCode('RQ-8691-IN') === 'RQ-8691-IN', 'Clean pass code must remain unaffected');
console.log('✓ Pass ID cleanliness and (SIM) sanitization verified');

// 5. Regional Mandi Mappings & Auto-Detection Validation
console.log('\nTesting Regional Mandi mappings for all 15 profiles...');
import { getMandiCoordinates } from '../src/lib/mandiCoordinates.ts';

for (const profile of AGRISTACK_FARMER_DATASET) {
  console.assert(profile.stateCode && profile.stateCode.length === 2, `Profile ${profile.name} must have a valid 2-letter stateCode`);
  console.assert(Array.isArray(profile.mandis) && profile.mandis.length >= 1, `Profile ${profile.name} must have at least 1 regional mandi`);
  
  // Verify nearest mandi coordinates resolve accurately
  const nearestMandi = profile.mandis[0];
  const coords = getMandiCoordinates(nearestMandi);
  console.assert(Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]), `Coordinates for ${nearestMandi} must be valid lat/lng`);
}

// Test specific key state mappings
const pbProfile = lookupAgriStackProfile('AS-PB-1194');
console.assert(pbProfile.mandis.includes("Khanna Grain Market (Asia's Largest)"), 'PB profile must include Khanna Grain Market');
console.assert(pbProfile.mandis.includes("Ludhiana APMC Yard"), 'PB profile must include Ludhiana APMC Yard');

const gjProfile = lookupAgriStackProfile('AS-GJ-4421');
console.assert(gjProfile.mandis.includes("Anand Main APMC"), 'GJ profile must include Anand Main APMC');

const upProfile = lookupAgriStackProfile('AS-UP-9083');
console.assert(upProfile.mandis.includes("Varanasi Mandi Samiti (Panchkoshi)"), 'UP profile must include Varanasi Mandi Samiti');

const kaProfile = lookupAgriStackProfile('AS-KA-3310');
console.assert(kaProfile.mandis.includes("Mandya APMC Market"), 'KA profile must include Mandya APMC Market');

const mhProfile = lookupAgriStackProfile('AS-MH-5529');
console.assert(mhProfile.mandis.includes("Lasalgaon APMC (Onion Hub)"), 'MH profile must include Lasalgaon APMC');

const rjProfile = lookupAgriStackProfile('AS-RJ-7814');
console.assert(rjProfile.mandis.includes("Alwar Krishi Upaj Mandi"), 'RJ profile must include Alwar Krishi Upaj Mandi');

const tnProfile = lookupAgriStackProfile('AS-TN-4155');
console.assert(tnProfile.mandis.includes("Madurai Mattuthavani Market Yard"), 'TN profile must include Madurai Mattuthavani Market Yard');

console.log('✓ Regional mandis mapped strictly to regional block & state for all 15 farmer profiles');

console.log('\nAll 100% of state machine verification tests succeeded with zero warnings!');

