import type Product from '../product'

declare module '@adonisjs/lucid/types/model' {
  interface ModelAttributes {
    isInWishlist?: boolean
  }
}

export default Product