import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AuthenticationException } from '@adonisjs/auth/exceptions'

export default class SellerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.auth.user?.isSeller()) {
      throw new AuthenticationException('Unauthorized access', 403)
    }

    return next()
  }
}