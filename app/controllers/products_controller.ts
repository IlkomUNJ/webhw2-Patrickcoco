import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

@inject()
export default class ProductsController {
  async index({ view, auth, request }: HttpContext) {
    const category = request.input('category')
    const availability = request.input('availability')
    const query = Product.query()

    if (category) {
      query.where('category', category)
    }

    if (availability === 'available') {
      query.where('isAvailable', true)
    } else if (availability === 'unavailable') {
      query.where('isAvailable', false)
    }

    const products = await query.exec()

    // If user is a seller, show the management view
    if (auth.user?.role === 'seller') {
      return view.render('pages/products/seller_index', { 
        products,
        category,
        availability
      })
    }

    // Otherwise show the customer menu view
    let productsWithWishlist = products
    
    // If user is logged in, check which products are in their wishlist
    if (auth.user) {
      const wishlists = await auth.user.related('wishlists').query().select('product_id')
      const wishlistProductIds = new Set(wishlists.map(w => w.productId))
      
      productsWithWishlist = products.map(product => ({
        ...product,
        isInWishlist: wishlistProductIds.has(product.id)
      }))
    }

    return view.render('pages/menu', { 
      products: productsWithWishlist,
      category,
      availability
    })
  }

  async show({ params, view, auth }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    
    if (auth.user) {
      const wishlist = await auth.user.related('wishlists').query()
        .where('product_id', product.id)
        .first()
      product.isInWishlist = !!wishlist
    }

    return view.render('pages/products/show', { product })
  }

  async search({ request, view }: HttpContext) {
    const query = request.input('q')
    const category = request.input('category')

    const productsQuery = Product.query()
      .where('is_available', true)

    if (query) {
      productsQuery.where('name', 'LIKE', `%${query}%`)
    }

    if (category) {
      productsQuery.where('category', category)
    }

    const products = await productsQuery.exec()
    return view.render('pages/products/search', { products, query, category })
  }

  // Seller routes
  async create({ view, auth }: HttpContext) {
    if (!auth.user?.isSeller()) {
      return 'Unauthorized'
    }
    return view.render('pages/products/create')
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user?.isSeller()) {
      return 'Unauthorized'
    }

    const data = request.only(['name', 'description', 'price', 'category', 'image'])
    await Product.create(data)

    return response.redirect().toRoute('products.index')
  }

  async edit({ params, view, auth }: HttpContext) {
    if (!auth.user?.isSeller()) {
      return 'Unauthorized'
    }

    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/edit', { product })
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.isSeller()) {
      return 'Unauthorized'
    }

    const product = await Product.findOrFail(params.id)
    const data = request.only(['name', 'description', 'price', 'category', 'image', 'is_available'])
    
    await product.merge(data).save()
    return response.redirect().toRoute('products.index')
  }
}