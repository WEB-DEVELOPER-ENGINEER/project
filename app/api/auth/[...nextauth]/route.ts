import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/database'
import { AdminUser } from '@/lib/types'

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const client = await pool.connect()
          console.log('Database connected for auth')
          
          const result = await client.query(
            'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
            [credentials.email]
          )
          client.release()

          console.log('Query result:', { 
            email: credentials.email, 
            found: result.rows.length > 0,
            isActive: result.rows[0]?.is_active 
          })

          if (result.rows.length === 0) {
            console.log('User not found or inactive')
            return null
          }

          const user: AdminUser = result.rows[0]
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          console.log('Password validation:', { isPasswordValid })

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          // Update last login
          const updateClient = await pool.connect()
          await updateClient.query(
            'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
          )
          updateClient.release()

          console.log('Auth successful for user:', user.email)

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }