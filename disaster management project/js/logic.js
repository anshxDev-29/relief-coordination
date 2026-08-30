// ============================================================
// Priority Scoring Logic — shared by request form + dispatch board
// ============================================================

// Base severity weight per emergency type (matches <select> values in request.html)
const SEVERITY_WEIGHTS = {
  critical_trapped: 95,
  medical_emergency: 85,
  food_water: 45,
  shelter_blankets: 55,
};

/**
 * Calculates a 0-100 priority score for a new request.
 * severity(40%) + vulnerability flags(30%) + trapped/urgent flag(10%) + headcount(20%, capped)
 */
export function calculatePriority({ emergencyType, hasVulnerable, isTrapped, headcount = 1 }) {
  const severity = SEVERITY_WEIGHTS[emergencyType] ?? 30;
  const vulnerabilityBonus = hasVulnerable ? 100 : 0;
  const trappedBonus = isTrapped ? 100 : 0;
  const headcountBonus = Math.min(headcount / 10, 1) * 100; // caps out at 10+ people

  const score =
    severity * 0.4 +
    vulnerabilityBonus * 0.3 +
    trappedBonus * 0.1 +
    headcountBonus * 0.2;

  return Math.round(score * 10) / 10;
}

export function priorityLabel(score) {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  return "medium";
}

// ============================================================
// Supply Kit Calculator — based on Sphere Humanitarian Standards
// (the same reference guidelines used by NDRF/UN disaster relief teams)
// ============================================================

/**
 * Calculates recommended relief supplies for a single request,
 * so responders don't need to manually work out quantities before packing.
 */
export function calculateSupplyKit({ headcount = 1, emergencyType, hasVulnerable, isTrapped }) {
  const people = Math.max(1, headcount);

  // Sphere standard: 15 liters of water per person per day (drinking + cooking + hygiene)
  const waterLiters = people * 15;

  // 3 food packets per person per day (breakfast/lunch/dinner)
  const foodPackets = people * 3;

  // 1 blanket per person as baseline; +1 extra per person if vulnerable group present
  // (elderly/infants/pregnant need extra warmth/layering)
  const blankets = hasVulnerable ? people * 2 : people;

  // First-aid kits: 1 per 5 people minimum, doubled for medical emergencies or trapped/injury cases
  const baseKits = Math.ceil(people / 5);
  const firstAidKits = (emergencyType === "medical_emergency" || isTrapped) ? baseKits * 2 : baseKits;

  // Emphasis note per emergency type — tells responders what to prioritize packing
  const emphasisNotes = {
    critical_trapped: "Prioritize rescue gear + first-aid kits — water/food secondary until extraction.",
    medical_emergency: "Prioritize first-aid kits and any noted urgent medication needs.",
    food_water: "Prioritize water and food packets — this is the core need.",
    shelter_blankets: "Prioritize blankets and tarps — structural/shelter need is primary.",
  };

  return {
    waterLiters,
    foodPackets,
    blankets,
    firstAidKits,
    note: emphasisNotes[emergencyType] || "Standard relief kit — pack based on quantities below.",
  };
}

// ============================================================
// Distance Calculator — used for offline "Nearest NGO" lookup
// ============================================================

/**
 * Haversine formula — great-circle distance between two lat/lng points, in km.
 * Works entirely offline once you have both coordinate pairs (no API needed).
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest NGO from a cached list, given the user's current coordinates.
 * Designed to work fully offline — no network call needed once ngoList is cached.
 */
export function findNearestNgo(ngoList, userLat, userLng) {
  const withCoords = ngoList.filter((n) => typeof n.lat === "number" && typeof n.lng === "number");
  if (withCoords.length === 0) return null;

  let nearest = null;
  let minDist = Infinity;

  for (const ngo of withCoords) {
    const d = distanceKm(userLat, userLng, ngo.lat, ngo.lng);
    if (d < minDist) {
      minDist = d;
      nearest = ngo;
    }
  }

  return nearest ? { ...nearest, distanceKm: Math.round(minDist * 10) / 10 } : null;
}
