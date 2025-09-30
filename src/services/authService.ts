// Authentication service for admin panel
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  Unsubscribe,
  AuthError
} from 'firebase/auth'
import { auth } from '../config/firebase'

// Admin credentials from environment variables
const ADMIN_EMAILS: string[] = import.meta.env.VITE_ADMIN_EMAILS
  ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((email: string) => email.trim())
  : ['admin@lombok.com', 'diego@lombok.com'] // fallback

// Auth state callback type
type AuthStateCallback = (user: User | null) => void

export const AuthService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Check if user is authorized admin
      if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        await this.signOut()
        throw new Error('No tienes permisos de administrador')
      }
      
      return user
    } catch (error) {
      console.error('Error signing in:', error)
      throw this.handleAuthError(error as AuthError)
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw this.handleAuthError(error as AuthError)
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  },

  // Check if user is authenticated and authorized
  isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    return user !== null && user.email !== null && ADMIN_EMAILS.includes(user.email)
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: AuthStateCallback): Unsubscribe {
    return onAuthStateChanged(auth, (user: User | null) => {
      const isAuthorized = user && user.email && ADMIN_EMAILS.includes(user.email)
      callback(isAuthorized ? user : null)
    })
  },

  // Create admin user (for initial setup only)
  async createAdminUser(email: string, password: string): Promise<User> {
    try {
      if (!ADMIN_EMAILS.includes(email)) {
        throw new Error('Email no autorizado para administrador')
      }
      
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error creating admin user:', error)
      throw this.handleAuthError(error as AuthError)
    }
  },

  // Handle authentication errors
  handleAuthError(error: AuthError): Error {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('Usuario no encontrado')
      case 'auth/wrong-password':
        return new Error('Contraseña incorrecta')
      case 'auth/invalid-email':
        return new Error('Email inválido')
      case 'auth/user-disabled':
        return new Error('Usuario deshabilitado')
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos fallidos. Intenta más tarde')
      case 'auth/network-request-failed':
        return new Error('Error de conexión. Verifica tu internet')
      case 'auth/email-already-in-use':
        return new Error('El email ya está en uso')
      case 'auth/weak-password':
        return new Error('La contraseña debe tener al menos 6 caracteres')
      default:
        return new Error(error.message || 'Error de autenticación')
    }
  }
}

export default AuthService
