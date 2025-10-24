import { BaseCommand } from '@adonisjs/core/ace'
import Product from '#models/product'

export default class AddInitialProducts extends BaseCommand {
  static commandName = 'add:initial-products'
  static description = 'Add initial products to the database'

  async run() {
    const products: {
      name: string
      description: string
      price: number
      category: 'richiise_bakar' | 'chicken_katsu' | 'chicken_steak'
      image: string
      isAvailable: boolean
    }[] = [
      {
        name: 'Richiise Bakar BBQ',
        description: 'Our signature grilled chicken with special BBQ sauce',
        price: 14000,
        category: 'richiise_bakar',
        image: '/images/rb1.jpg',
        isAvailable: true
      },
      {
        name: 'Richiise Bakar Black Pepper',
        description: 'Grilled chicken with rich black pepper sauce',
        price: 15000,
        category: 'richiise_bakar',
        image: '/images/rb1.jpg',
        isAvailable: true
      },
      {
        name: 'Richiise Bakar Hot Fire',
        description: 'Spicy grilled chicken for those who love heat 🌶️',
        price: 15000,
        category: 'richiise_bakar',
        image: '/images/rb1.jpg',
        isAvailable: true
      },
      {
        name: 'Chicken Katsu Original',
        description: 'Crispy Japanese-style breaded chicken cutlet',
        price: 14000,
        category: 'chicken_katsu',
        image: '/images/rb2.jpg',
        isAvailable: true
      },
      {
        name: 'Chicken Katsu Spicy',
        description: 'Crispy chicken katsu with spicy seasoning',
        price: 15000,
        category: 'chicken_katsu',
        image: '/images/rb2.jpg',
        isAvailable: true
      },
      {
        name: 'Chicken Steak Original',
        description: 'Juicy grilled chicken steak with special sauce',
        price: 16000,
        category: 'chicken_steak',
        image: '/images/rb3.jpg',
        isAvailable: true
      },
      {
        name: 'Chicken Steak Black Pepper',
        description: 'Chicken steak with rich black pepper gravy',
        price: 17000,
        category: 'chicken_steak',
        image: '/images/rb3.jpg',
        isAvailable: true
      }
    ]

    this.logger.info('Adding initial products...')

    for (const product of products) {
      await Product.create(product)
      this.logger.success(`Added: ${product.name}`)
    }

    this.logger.success('All products have been added successfully!')
  }
}