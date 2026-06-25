import { AuthProvider } from 'react-admin'
import { signIn, signOut, getSession } from 'next-auth/react'

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return Promise.reject(new Error('Invalid email or password'))
      }

      if (result?.ok) {
        return Promise.resolve()
      }

      return Promise.reject(new Error('Login failed'))
    } catch (error) {
      return Promise.reject(new Error('Network error'))
    }
  },

  logout: async () => {
    try {
      await signOut({ redirect: false })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(new Error('Logout failed'))
    }
  },

  checkAuth: async () => {
    try {
      const session = await getSession()
      if (session?.user) {
        return Promise.resolve()
      }
      // Force a proper page redirect instead of client-side routing
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
      return Promise.reject({ redirectTo: '/admin/login' })
    } catch (error) {
      // Force a proper page redirect instead of client-side routing
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
      return Promise.reject({ redirectTo: '/admin/login' })
    }
  },

  checkError: (error) => {
    const status = error.status
    if (status === 401 || status === 403) {
      return Promise.reject()
    }
    return Promise.resolve()
  },

  getIdentity: async () => {
    try {
      const session = await getSession()
      if (session?.user) {
        return Promise.resolve({
          id: session.user.id || session.user.email,
          fullName: session.user.name || session.user.email,
          avatar: undefined,
        })
      }
    } catch (error) {
      // Session error
    }
    return Promise.reject()
  },

  getPermissions: async () => {
    try {
      const session = await getSession()
      if (session?.user?.role) {
        return Promise.resolve(session.user.role)
      }
    } catch (error) {
      // Session error
    }
    return Promise.reject()
  },
}