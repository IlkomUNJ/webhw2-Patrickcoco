import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, loginValidator } from '#validators/auth'
import User from '#models/user'

@inject()
export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async login({ request, response, auth, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      
      // Find user first
      const user = await User.findBy('email', email)
      if (!user) {
        session.flash('error', 'Invalid credentials')
        return response.redirect().back()
      }

      // Verify password
      try {
        await User.verifyCredentials(email, password)
      } catch {
        session.flash('error', 'Invalid credentials')
        return response.redirect().back()
      }

      // Log user in
      await auth.use('web').login(user)
      
      // Debug: Store user data in session
      session.put('user', {
        id: user.id,
        email: user.email,
        role: user.role
      })
      
      // Redirect based on role
      if (user.role === 'seller') {
        return response.redirect('/products/create')
      } else {
        return response.redirect('/menu')
      }
    } catch (error) {
      console.error('Login error:', error)
      session.flash('error', 'An error occurred during login')
      return response.redirect().back()
    }
  }

  async register({ request, response, auth, session }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator)
      
      // Check if email already exists
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        session.flash('error', 'Email already registered. Please use a different email or login.')
        return response.redirect().back()
      }

      // Create the user
      const user = await User.create({
        email: data.email,
        password: data.password,
        role: data.role || 'user' // Default to 'user' if not specified
      })

      // Log them in
      await auth.use('web').login(user)
      
      // Redirect based on role
      if (user.role === 'seller') {
        return response.redirect('/products/create')
      } else {
        return response.redirect('/menu')
      }
    } catch (error) {
      console.error('Registration error:', error)
      session.flash('error', 'An error occurred during registration. Please try again.')
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    try {
      await auth.use('web').logout()
      session.clear() // Clear all session data
      return response.redirect().withQs({ loggedOut: true }).toPath('/')
    } catch (error) {
      console.error('Logout error:', error)
      session.flash('error', 'Error during logout')
      return response.redirect().back()
    }
  }
}