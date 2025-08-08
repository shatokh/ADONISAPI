/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler converts exceptions to HTTP responses.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * Global middleware stack - runs on every request.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * Router middleware stack - runs on routes with handlers.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

/**
 * Named middleware for assigning to routes or route groups.
 */
export const middleware = router.named({
  // Built-in
  auth: () => import('#middleware/auth_middleware'),
  guest: () => import('#middleware/allow_guest_middleware'),

  // Custom admin check
  isAdmin: () => import('App/Middleware/IsAdmin'),
})
