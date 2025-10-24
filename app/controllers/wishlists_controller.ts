import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Wishlist from '#models/wishlist'
import Product from '#models/product'

@inject()
export default class WishlistsController {
  async index({ view, session }: HttpContext) {
    // Get wishlist from session or initialize empty array
    const wishlistIds = session.get('wishlist', [])
    
    // Fetch products for the wishlist items
    const products = await Product.query()
      .whereIn('id', wishlistIds)
      .exec()

    // Map products to include isInWishlist flag
    const productsWithWishlist = products.map(product => ({
      ...product,
      isInWishlist: true // All products in wishlist view are in wishlist
    }))

    return view.render('pages/wishlists/index', { products: productsWithWishlist })
  }

  async store({ request, response, session }: HttpContext) {
    const productId = request.input('product_id')
    const product = await Product.findOrFail(productId)

    // Get current wishlist from session or initialize empty array
    let wishlist = session.get('wishlist', [])
    
    // Add product if not already in wishlist
    if (!wishlist.includes(product.id)) {
      wishlist.push(product.id)
      session.put('wishlist', wishlist)
    }

    // If it's an AJAX request, return JSON response
    if (request.accepts(['html', 'json']) === 'json') {
      return response.json({
        success: true,
        message: 'Product added to wishlist',
        inWishlist: true
      })
    }

    return response.redirect().back()
  }

  async destroy({ params, response, session, request }: HttpContext) {
    // Get current wishlist from session
    let wishlist = session.get('wishlist', [])
    
    // Remove the product from wishlist
    wishlist = wishlist.filter(id => id !== parseInt(params.id))
    session.put('wishlist', wishlist)

    // If it's an AJAX request, return JSON response
    if (request.accepts(['html', 'json']) === 'json') {
      return response.json({
        success: true,
        message: 'Product removed from wishlist',
        inWishlist: false
      })
    }

    return response.redirect().back()
  }
}