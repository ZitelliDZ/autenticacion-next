/**
 * Rutas publicas
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
    '/auth/new-verification',
]
/**
 * Rutas de autenticación
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset-password',
    '/auth/new-verification',
]

/**
 * Ruta de autenticación de la API
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';
/**
 * Ruta de redirección por defecto
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
