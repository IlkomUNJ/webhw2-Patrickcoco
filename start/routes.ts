/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import db from '@adonisjs/lucid/services/db'

// Temporary route to list users (REMOVE IN PRODUCTION)
router.get('/_debug/users', async ({ response }) => {
  const users = await db.query().from('users').select('*')
  return response.json(users)
})

// Debug route to check auth status
router.get('/_debug/auth', async ({ auth, response }) => {
  const isAuthenticated = await auth.use('web').check()
  return response.json({
    isAuthenticated,
    user: auth.user
  })
})

// Auth routes
router.get('/login', '#controllers/auth_controller.showLogin').as('auth.login').use(middleware.guest())
router.post('/login', '#controllers/auth_controller.login').as('auth.login.store').use(middleware.guest())
router.get('/register', '#controllers/auth_controller.showRegister').as('auth.register').use(middleware.guest())
router.post('/register', '#controllers/auth_controller.register').as('auth.register.store').use(middleware.guest())
router.post('/logout', '#controllers/auth_controller.logout').as('auth.logout').use(middleware.auth())

// Public routes
router.on('/').render('pages/index').as('home')
router.get('/menu', '#controllers/products_controller.index').as('menu.index')
router.get('/products', '#controllers/products_controller.index').as('products.index')
router.get('/products/search', '#controllers/products_controller.search').as('products.search')
router.get('/products/:id', '#controllers/products_controller.show').as('products.show')
router.get('/contact', ({ view }) => view.render('pages/contact')).as('contact')

// Public wishlist routes
router.get('/wishlist', '#controllers/wishlists_controller.index').as('wishlists.index')
router.post('/wishlist', '#controllers/wishlists_controller.store').as('wishlists.store')
router.delete('/wishlist/:id', '#controllers/wishlists_controller.destroy').as('wishlists.destroy')

// Authentication required routes
router.group(() => {
  // Seller routes
  router.group(() => {
    router.get('/products/create', '#controllers/products_controller.create').as('products.create')
    router.post('/products', '#controllers/products_controller.store').as('products.store')
    router.get('/products/:id/edit', '#controllers/products_controller.edit').as('products.edit')
    router.put('/products/:id', '#controllers/products_controller.update').as('products.update')
    router.delete('/products/:id', '#controllers/products_controller.destroy').as('products.destroy')
  }).use(middleware.seller())
}).use(middleware.auth())
