
export const LOCALITIES = [
  'Akkulam',
  'Ambalamukku',
  'Ambalathara',
  'Anayara',
  'Attingal',
  'Attukal',
  'Balaramapuram',
  'Beemapally',
  'Chackai',
  'Chanthavila',
  'Chenkottukonam',
  'East Fort',
  'Enchakkal',
  'Gandhipuram',
  'Jagathy',
  'Kaniyapuram',
  'Karamana',
  'Karyavattom',
  'Kazhakkoottam',
  'Kesavadasapuram',
  'Kilimanoor',
  'Kovalam',
  'Kowdiar',
  'Kudappanakunnu',
  'Kumarapuram',
  'Kuravankonam',
  'Malayinkeezhu',
  'Manacaud',
  'Mangalapuram',
  'Mannanthala',
  'Maruthankuzhy',
  'Medical College',
  'Menamkulam',
  'Muttada',
  'Nalanchira',
  'Nedumangad',
  'Nemom',
  'Neyyattinkara',
  'Ooruttambalam',
  'Palayam',
  'Pallipuram',
  'Pangappara',
  'Pappanamcode',
  'Pattom',
  'Peroorkada',
  'Pettah',
  'Peyad',
  'Pongumoodu',
  'Poojappura',
  'Pothencode',
  'Powdikonam',
  'Pravachambalam',
  'Pulayanarkotta',
  'Sasthamangalam',
  'Shangumugham',
  'Sreekaryam',
  'St. Andrews',
  'Statue',
  'Technocity',
  'Technopark Area',
  'Thampanoor',
  'Thirumala',
  'Thiruvallam',
  'Thumba',
  'Ulloor',
  'Vanchiyoor',
  'Varkala',
  'Vattiyoorkavu',
  'Vazhuthacaud',
  'Veli',
  'Vellayambalam',
  'Vellayani',
  'Venjaramoodu',
  'Vizhinjam'
];

// Map of Locality Name -> Approx Distance to nearest beach (in km)
export const LOCALITY_META: Record<string, number> = {
  'Akkulam': 3.5,
  'Ambalamukku': 9.0,
  'Ambalathara': 4.5,
  'Anayara': 4.0,
  'Attingal': 10.0, // River/Inland
  'Attukal': 5.0,
  'Balaramapuram': 12.0,
  'Beemapally': 0.5, // Coastal
  'Chackai': 2.5,
  'Chanthavila': 12.0,
  'Chenkottukonam': 14.0,
  'East Fort': 4.5,
  'Enchakkal': 3.5,
  'Gandhipuram': 10.0,
  'Jagathy': 7.0,
  'Kaniyapuram': 6.0,
  'Karamana': 6.0,
  'Karyavattom': 8.0,
  'Kazhakkoottam': 3.0,
  'Kesavadasapuram': 7.0,
  'Kilimanoor': 25.0,
  'Kovalam': 0.5, // Coastal
  'Kowdiar': 7.5, // Inland Premium
  'Kudappanakunnu': 10.0,
  'Kumarapuram': 5.5,
  'Kuravankonam': 8.0,
  'Malayinkeezhu': 14.0,
  'Manacaud': 5.0,
  'Mangalapuram': 8.0,
  'Mannanthala': 10.0,
  'Maruthankuzhy': 8.0,
  'Medical College': 6.0,
  'Menamkulam': 1.5, // Near St Andrews
  'Muttada': 8.5,
  'Nalanchira': 9.0,
  'Nedumangad': 18.0,
  'Nemom': 10.0,
  'Neyyattinkara': 15.0,
  'Ooruttambalam': 14.0,
  'Palayam': 5.5,
  'Pallipuram': 5.0,
  'Pangappara': 6.0,
  'Pappanamcode': 8.0,
  'Pattom': 6.5,
  'Peroorkada': 9.0,
  'Pettah': 4.0,
  'Peyad': 12.0,
  'Pongumoodu': 7.0,
  'Poojappura': 8.0,
  'Pothencode': 14.0,
  'Powdikonam': 11.0,
  'Pravachambalam': 11.0,
  'Pulayanarkotta': 4.0,
  'Sasthamangalam': 8.0,
  'Shangumugham': 0.2, // Coastal
  'Sreekaryam': 7.0,
  'St. Andrews': 0.3, // Coastal
  'Statue': 5.0,
  'Technocity': 6.0,
  'Technopark Area': 3.0,
  'Thampanoor': 5.0,
  'Thirumala': 10.0,
  'Thiruvallam': 5.0,
  'Thumba': 0.5, // Coastal
  'Ulloor': 6.5,
  'Vanchiyoor': 4.5,
  'Varkala': 1.0, // Coastal
  'Vattiyoorkavu': 10.0,
  'Vazhuthacaud': 6.5,
  'Veli': 0.5, // Coastal
  'Vellayambalam': 7.0,
  'Vellayani': 8.0, // Lake, not sea
  'Venjaramoodu': 22.0,
  'Vizhinjam': 0.5
};

// Approximate reference baselines for chart context (in Lakhs/cent)
// These act as anchors for the comparative chart.
export const BENCHMARK_RATES = {
  PREMIUM: 28.0, // e.g., Kowdiar/Sasthamangalam avg
  TECH_HUB: 15.0, // e.g., Kazhakkoottam avg
  CITY_AVG: 10.0, // General city avg
  SUBURB: 6.0     // e.g., Pothencode/Vattiyoorkavu avg
};

export const APP_TITLE = "Trivandrum Realty";
export const APP_DESC = "Developer-focused estimator for Plots & Villas in Trivandrum, featuring NRI investment suitability scores and airport connectivity analysis.";

// ========================================
// GPS COORDINATES - Professional Data
// ========================================

export interface Coordinates {
  lat: number;
  lng: number;
}

// GPS coordinates for all 76 Trivandrum localities
export const LOCALITY_COORDS: Record<string, Coordinates> = {
  'Akkulam': { lat: 8.5243, lng: 76.9225 },
  'Ambalamukku': { lat: 8.4936, lng: 76.9553 },
  'Ambalathara': { lat: 8.5032, lng: 76.9012 },
  'Anayara': { lat: 8.5601, lng: 76.9034 },
  'Attingal': { lat: 8.6905, lng: 76.8155 },
  'Attukal': { lat: 8.4852, lng: 76.9456 },
  'Balaramapuram': { lat: 8.3827, lng: 76.9682 },
  'Beemapally': { lat: 8.4789, lng: 76.9256 },
  'Chackai': { lat: 8.5012, lng: 76.9298 },
  'Chanthavila': { lat: 8.3501, lng: 77.0234 },
  'Chenkottukonam': { lat: 8.6123, lng: 77.0456 },
  'East Fort': { lat: 8.4976, lng: 76.9512 },
  'Enchakkal': { lat: 8.5156, lng: 76.9234 },
  'Gandhipuram': { lat: 8.3945, lng: 76.9834 },
  'Jagathy': { lat: 8.5423, lng: 76.9567 },
  'Kaniyapuram': { lat: 8.5789, lng: 76.8845 },
  'Karamana': { lat: 8.5123, lng: 76.9678 },
  'Karyavattom': { lat: 8.5567, lng: 76.9012 },
  'Kazhakkoottam': { lat: 8.5967, lng: 76.8734 },
  'Kesavadasapuram': { lat: 8.5245, lng: 76.9456 },
  'Kilimanoor': { lat: 8.6445, lng: 77.0534 },
  'Kovalam': { lat: 8.4001, lng: 76.9788 },
  'Kowdiar': { lat: 8.5241, lng: 76.9478 },
  'Kudappanakunnu': { lat: 8.5089, lng: 77.0012 },
  'Kumarapuram': { lat: 8.4956, lng: 76.9589 },
  'Kuravankonam': { lat: 8.5334, lng: 76.9823 },
  'Malayinkeezhu': { lat: 8.4012, lng: 77.0123 },
  'Manacaud': { lat: 8.5134, lng: 76.9712 },
  'Mangalapuram': { lat: 8.4523, lng: 76.9123 },
  'Mannanthala': { lat: 8.5456, lng: 77.0001 },
  'Maruthankuzhy': { lat: 8.5689, lng: 76.8923 },
  'Medical College': { lat: 8.5301, lng: 76.9445 },
  'Menamkulam': { lat: 8.8234, lng: 76.7512 },
  'Muttada': { lat: 8.4678, lng: 76.9934 },
  'Nalanchira': { lat: 8.5167, lng: 77.0034 },
  'Nedumangad': { lat: 8.6012, lng: 77.0012 },
  'Nemom': { lat: 8.4123, lng: 76.9934 },
  'Neyyattinkara': { lat: 8.3989, lng: 77.0823 },
  'Ooruttambalam': { lat: 8.6234, lng: 77.0623 },
  'Palayam': { lat: 8.5067, lng: 76.9523 },
  'Pallipuram': { lat: 8.4823, lng: 76.9134 },
  'Pangappara': { lat: 8.5523, lng: 76.9012 },
  'Pappanamcode': { lat: 8.5578, lng: 76.9123 },
  'Pattom': { lat: 8.5147, lng: 76.9470 },
  'Peroorkada': { lat: 8.5412, lng: 76.9989 },
  'Pettah': { lat: 8.5134, lng: 76.9534 },
  'Peyad': { lat: 8.6156, lng: 77.0234 },
  'Pongumoodu': { lat: 8.5234, lng: 76.9456 },
  'Poojappura': { lat: 8.5167, lng: 76.9734 },
  'Pothencode': { lat: 8.6812, lng: 76.9445 },
  'Powdikonam': { lat: 8.5789, lng: 76.9823 },
  'Pravachambalam': { lat: 8.5523, lng: 77.0012 },
  'Pulayanarkotta': { lat: 8.5334, lng: 76.9234 },
  'Sasthamangalam': { lat: 8.5412, lng: 76.9445 },
  'Shangumugham': { lat: 8.4723, lng: 76.9201 },
  'Sreekaryam': { lat: 8.5712, lng: 76.9023 },
  'St. Andrews': { lat: 8.4834, lng: 76.9178 },
  'Statue': { lat: 8.4934, lng: 76.9456 },
  'Technocity': { lat: 8.5456, lng: 76.8934 },
  'Technopark Area': { lat: 8.5473, lng: 76.9012 },
  'Thampanoor': { lat: 8.4901, lng: 76.9534 },
  'Thirumala': { lat: 8.5623, lng: 76.9823 },
  'Thiruvallam': { lat: 8.5334, lng: 76.9123 },
  'Thumba': { lat: 8.5334, lng: 76.8812 },
  'Ulloor': { lat: 8.5456, lng: 76.9445 },
  'Vanchiyoor': { lat: 8.4967, lng: 76.9512 },
  'Varkala': { lat: 8.7380, lng: 76.7160 },
  'Vattiyoorkavu': { lat: 8.5567, lng: 77.0056 },
  'Vazhuthacaud': { lat: 8.5089, lng: 76.9567 },
  'Veli': { lat: 8.4823, lng: 76.9156 },
  'Vellayambalam': { lat: 8.5178, lng: 76.9489 },
  'Vellayani': { lat: 8.4345, lng: 77.0012 },
  'Venjaramoodu': { lat: 8.6789, lng: 77.0623 },
  'Vizhinjam': { lat: 8.3801, lng: 76.9890 }
};

// Key landmarks for distance calculations
export const LANDMARKS = {
  AIRPORT: {
    name: 'Trivandrum International Airport (TRV)',
    coords: { lat: 8.4821, lng: 76.9200 }
  },
  LULU_MALL: {
    name: 'Lulu Mall Trivandrum',
    coords: { lat: 8.5132, lng: 76.9506 }
  },
  TECHNOPARK: {
    name: 'Technopark Phase 1',
    coords: { lat: 8.5473, lng: 76.9012 }
  },
  RAILWAY_STATION: {
    name: 'Trivandrum Central Railway Station',
    coords: { lat: 8.4901, lng: 76.9534 }
  },
  MEDICAL_COLLEGE: {
    name: 'Government Medical College Hospital',
    coords: { lat: 8.5301, lng: 76.9445 }
  },
  SCTIMST: {
    name: 'SCTIMST Hospital',
    coords: { lat: 8.5345, lng: 76.9712 }
  }
};

// Major schools for "Mom Test" social infrastructure - Distributed across Trivandrum
export const TOP_SCHOOLS = [
  // Central Trivandrum
  { name: 'Loyola School', coords: { lat: 8.5123, lng: 76.9551 } },
  { name: 'Holy Angels ISC School', coords: { lat: 8.5234, lng: 76.9478 } },
  { name: 'Kendriya Vidyalaya Pattom', coords: { lat: 8.5167, lng: 76.9489 } },
  { name: 'Sarvodaya Vidyalaya', coords: { lat: 8.5089, lng: 76.9534 } },
  { name: 'St. Joseph\'s School', coords: { lat: 8.5045, lng: 76.9623 } },
  { name: 'Chinmaya Vidyalaya', coords: { lat: 8.5456, lng: 76.9423 } },

  // Coastal Area (Kovalam, Vizhinjam)
  { name: 'Govt. Model School Kovalam', coords: { lat: 8.4050, lng: 76.9750 } },
  { name: 'Vizhinjam Public School', coords: { lat: 8.3820, lng: 76.9900 } },

  // Tech Corridor
  { name: 'Technopark Public School', coords: { lat: 8.5550, lng: 76.8800 } },
  { name: 'Oxford School Kazhakkoottam', coords: { lat: 8.5650, lng: 76.8750 } },

  // Northern Suburbs
  { name: 'Kendriya Vidyalaya Peroorkada', coords: { lat: 8.5450, lng: 76.9700 } },
  { name: 'NSS School Nedumangad', coords: { lat: 8.6050, lng: 77.0050 } }
];

// Major hospitals for social infrastructure - Distributed across Trivandrum
export const MAJOR_HOSPITALS = [
  // Central Trivandrum
  { name: 'SIMS Hospital', coords: { lat: 8.5167, lng: 76.9523 } },
  { name: 'KIMS Hospital', coords: { lat: 8.5123, lng: 76.9456 } },
  { name: 'Meditrina Hospital', coords: { lat: 8.5234, lng: 76.9512 } },
  { name: 'Baby Memorial Hospital', coords: { lat: 8.5045, lng: 76.9589 } },
  { name: 'SCTIMST', coords: { lat: 8.5345, lng: 76.9712 } },
  { name: 'Cosmopolitan Hospital', coords: { lat: 8.5456, lng: 76.9623 } },

  // Coastal Area
  { name: 'Upasana Hospital Kovalam', coords: { lat: 8.4100, lng: 76.9800 } },
  { name: 'Govt. Hospital Vizhinjam', coords: { lat: 8.3850, lng: 76.9920 } },

  // Tech Corridor  
  { name: 'KIMS Kazhakkoottam', coords: { lat: 8.5600, lng: 76.8800 } },

  // Northern Areas
  { name: 'Govt. Hospital Nedumangad', coords: { lat: 8.6000, lng: 77.0000 } },
  { name: 'PRS Hospital', coords: { lat: 8.5400, lng: 76.9800 } }
];

// Locality tier classification for NRI scoring
// Based on infrastructure, connectivity, and market dynamics
export const LOCALITY_TIERS: Record<string, 'Premium' | 'Tech' | 'City' | 'Suburb'> = {
  'Kowdiar': 'Premium',
  'Sasthamangalam': 'Premium',
  'Vellayambalam': 'Premium',
  'Medical College': 'Premium',
  'Pattom': 'Premium',
  'Vazhuthacaud': 'Premium',

  'Kazhakkoottam': 'Tech',
  'Technopark Area': 'Tech',
  'Technocity': 'Tech',
  'Sreekaryam': 'Tech',
  'Karyavattom': 'Tech',
  'Pappanamcode': 'Tech',

  'Palayam': 'City',
  'Thampanoor': 'City',
  'East Fort': 'City',
  'Statue': 'City',
  'Kesavadasapuram': 'City',
  'Jagathy': 'City',
  'Ulloor': 'City',
  'Kumarapuram': 'City',
  'Pettah': 'City',
  'Vanchiyoor': 'City',
  'Manacaud': 'City',
  'Poojappura': 'City',
  'Karamana': 'City',

  // All others default to 'Suburb'
  'Akkulam': 'Suburb',
  'Ambalamukku': 'Suburb',
  'Ambalathara': 'Suburb',
  'Anayara': 'Suburb',
  'Attingal': 'Suburb',
  'Attukal': 'Suburb',
  'Balaramapuram': 'Suburb',
  'Beemapally': 'Suburb',
  'Chackai': 'Suburb',
  'Chanthavila': 'Suburb',
  'Chenkottukonam': 'Suburb',
  'Enchakkal': 'Suburb',
  'Gandhipuram': 'Suburb',
  'Kaniyapuram': 'Suburb',
  'Kilimanoor': 'Suburb',
  'Kovalam': 'Suburb',
  'Kudappanakunnu': 'Suburb',
  'Kuravankonam': 'Suburb',
  'Malayinkeezhu': 'Suburb',
  'Mangalapuram': 'Suburb',
  'Mannanthala': 'Suburb',
  'Maruthankuzhy': 'Suburb',
  'Menamkulam': 'Suburb',
  'Muttada': 'Suburb',
  'Nalanchira': 'Suburb',
  'Nedumangad': 'Suburb',
  'Nemom': 'Suburb',
  'Neyyattinkara': 'Suburb',
  'Ooruttambalam': 'Suburb',
  'Pallipuram': 'Suburb',
  'Pangappara': 'Suburb',
  'Peroorkada': 'Suburb',
  'Peyad': 'Suburb',
  'Pongumoodu': 'Suburb',
  'Pothencode': 'Suburb',
  'Powdikonam': 'Suburb',
  'Pravachambalam': 'Suburb',
  'Pulayanarkotta': 'Suburb',
  'Shangumugham': 'Suburb',
  'St. Andrews': 'Suburb',
  'Thirumala': 'Suburb',
  'Thiruvallam': 'Suburb',
  'Thumba': 'Suburb',
  'Varkala': 'Suburb',
  'Vattiyoorkavu': 'Suburb',
  'Veli': 'Suburb',
  'Vellayani': 'Suburb',
  'Venjaramoodu': 'Suburb'
};
