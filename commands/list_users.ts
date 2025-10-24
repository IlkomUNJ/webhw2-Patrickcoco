import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class ListUsers extends BaseCommand {
  static commandName = 'list:users'
  static description = 'List all registered users'

  async run() {
    const users = await db.query().from('users').select('*')
    
    this.logger.info('Registered Users:')
    this.logger.info('----------------')
    
    for (const user of users) {
      this.logger.info(`ID: ${user.id}`)
      this.logger.info(`Email: ${user.email}`)
      this.logger.info(`Role: ${user.role}`)
      this.logger.info('----------------')
    }

    process.exit(0)
  }
}