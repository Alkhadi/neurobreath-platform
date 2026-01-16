/**
 * Route Fixtures
 * 
 * Provides concrete example URLs for dynamic routes.
 * Each key must match the pattern from route-inventory.mjs output.
 */

export const routeFixtures: Record<string, string[]> = {
  // Parent dashboard routes
  "/parent/:parentCode": [
    "/parent/demo-parent-123",
    "/parent/test-parent"
  ],
  
  // Add more dynamic route fixtures here as they are discovered
  // Format: "/path/:param": ["/path/example1", "/path/example2"]
};

/**
 * Get all concrete URLs for a given route pattern
 */
export function getFixtures(pattern: string): string[] {
  return routeFixtures[pattern] || [];
}

/**
 * Check if a pattern has fixtures defined
 */
export function hasFixtures(pattern: string): boolean {
  const fixtures = routeFixtures[pattern];
  return fixtures !== undefined && fixtures.length > 0;
}

/**
 * Get all patterns that need fixtures
 */
export function getMissingFixtures(patterns: string[]): string[] {
  return patterns.filter(pattern => !hasFixtures(pattern));
}
