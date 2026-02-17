#!/usr/bin/env node
/**
 * nbcard-mapHref-check.mjs — Self-check script for map link generation
 * No external dependencies; pure Node.js
 */

// Minimal URL validation (mirrors sanitize.ts)
function isValidHttpUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Simplified buildMapHref logic (mirrors mapHref.ts)
function buildMapHref(addressCard) {
  if (!addressCard) {
    return "https://www.google.com/maps";
  }

  // 1. Check mapUrlOverride first
  if (addressCard.mapUrlOverride && isValidHttpUrl(addressCard.mapUrlOverride)) {
    return addressCard.mapUrlOverride;
  }

  // 2. Check mapDestinationOverride (or legacy mapQueryOverride)
  const customDestination = addressCard.mapDestinationOverride || addressCard.mapQueryOverride;
  
  if (customDestination) {
    // If someone pasted a URL into the destination field, treat it as a URL override
    if (isValidHttpUrl(customDestination)) {
      return customDestination;
    }
    
    // Use it as a destination string
    const encoded = encodeURIComponent(customDestination.trim());
    return `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`;
  }

  // 3. Compose from address fields
  const parts = [
    addressCard.addressLine1,
    addressCard.addressLine2,
    addressCard.city,
    addressCard.postcode,
    addressCard.country,
  ].filter((v) => v && typeof v === "string" && v.trim().length > 0);
  
  if (parts.length === 0) {
    return "https://www.google.com/maps";
  }
  
  const destination = parts.join(", ");
  const encoded = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`;
}

// Test cases
const tests = [
  {
    name: "mapUrlOverride wins",
    input: {
      mapUrlOverride: "https://maps.google.com/?q=custom",
      addressLine1: "123 Main St",
    },
    expected: "https://maps.google.com/?q=custom",
  },
  {
    name: "URL in mapDestinationOverride is treated as URL",
    input: {
      mapDestinationOverride: "https://goo.gl/maps/example",
    },
    expected: "https://goo.gl/maps/example",
  },
  {
    name: "Plain destination text",
    input: {
      mapDestinationOverride: "Eiffel Tower, Paris",
    },
    expected: "https://www.google.com/maps/dir/?api=1&destination=Eiffel%20Tower%2C%20Paris&travelmode=driving",
  },
  {
    name: "Composed address",
    input: {
      addressLine1: "10 Downing St",
      city: "London",
      postcode: "SW1A 2AA",
      country: "UK",
    },
    expected: "https://www.google.com/maps/dir/?api=1&destination=10%20Downing%20St%2C%20London%2C%20SW1A%202AA%2C%20UK&travelmode=driving",
  },
  {
    name: "No address data",
    input: {},
    expected: "https://www.google.com/maps",
  },
];

let passed = 0;
let failed = 0;

tests.forEach((test) => {
  const result = buildMapHref(test.input);
  if (result === test.expected) {
    console.log(`✅ PASS: ${test.name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${test.name}`);
    console.error(`  Expected: ${test.expected}`);
    console.error(`  Got:      ${result}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
