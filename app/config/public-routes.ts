/**
 * Public routes configuration
 * Routes that don't require authentication
 */


// Route patterns (partial match using includes)
export const PUBLIC_ROUTE_PATTERNS: string[] = [
    '/xaicombat',
    '/miniapps',
    // Add more public route patterns here
];

/**
 * Check if a given path is a public route that doesn't require authentication
 */
export const isPublicRoute = (path: string | null): boolean => {
    if (!path) return false;

    // Check pattern matches
    return PUBLIC_ROUTE_PATTERNS.some(pattern => path.includes(pattern));
}; 