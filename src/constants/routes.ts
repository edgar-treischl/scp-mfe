/**
 * Route definitions and constants
 * Centralized location for all navigation routes
 */

/**
 * All supported route types in the application
 */
export const ROUTES = {
  LANDING: 'landing',
  SELECT: 'select',
  FORM: 'form',
  HISTORY: 'history',
  VIEW: 'view',
  ABOUT: 'about',
  EVAL: 'eval',
  NEW: 'new',
  NEW_CREATE: 'new-create',
  NEW_LOAD: 'new-load',
  ALL: 'all',
  DATA: 'data',
} as const;

/**
 * All valid route keys
 */
export type RouteKey = keyof typeof ROUTES;

/**
 * All valid route values
 */
export type RouteValue = (typeof ROUTES)[RouteKey];

/**
 * Routes that require a submission ID parameter
 */
export const ROUTES_WITH_ID = [ROUTES.FORM, ROUTES.VIEW, ROUTES.EVAL] as const;

/**
 * Routes that are only for Schule (school) role
 */
export const SCHULE_ROUTES = [ROUTES.HISTORY, ROUTES.NEW_LOAD] as const;

/**
 * Routes that are only for Aufsicht (supervision) role
 */
export const AUFSICHT_ROUTES = [ROUTES.ALL] as const;

/**
 * Parse a hash string and extract the route and submission ID
 * @param hash - The location hash (e.g., "landing", "view/123")
 * @returns Object with route and optional submissionId
 */
export function parseHashRoute(hash: string): { route: RouteValue; submissionId?: string } {
  const parts = hash.slice(1).split('/');
  const routeString = parts[1];

  const isValidRoute = Object.values(ROUTES).includes(routeString as RouteValue);
  const route = isValidRoute ? (routeString as RouteValue) : ROUTES.LANDING;
  const submissionId = parts[2];

  return { route, submissionId };
}

/**
 * Generate a navigation hash for a given route
 * @param route - The route to navigate to
 * @param submissionId - Optional submission ID for routes that need it
 * @returns The hash string (e.g., "/form/123")
 */
export function generateHash(route: RouteValue, submissionId?: string): string {
  return `/${route}${submissionId ? `/${submissionId}` : ''}`;
}
