#!/usr/bin/env npx tsx

/**
 * Script to create an admin user for the admin panel on remote Supabase DB
 */

import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

// Create a pool using the DATABASE_URL (Supabase Postgres connection string)
const pool = new Pool({
  user: "postgres.upfyfznpurjtwplozpre",
  host: "aws-1-us-east-1.pooler.supabase.com",
  database: "postgres",
  password: "X52S2K9DT5daYe1y",
  port: 6543,
  ssl: { rejectUnauthorized: false },
})

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@jusor.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'
  const role = 'admin'

  try {
    console.log('Connecting to remote Supabase DB...')
    const client = await pool.connect()
    console.log('Connected!')

    console.log('Creating admin user...')

    // Hash the password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Check if admin user already exists
    const existingUser = await client.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      console.log(`Admin user with email ${email} already exists.`)

      // Update password if needed
      await client.query(
        'UPDATE admin_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
        [passwordHash, email]
      )
      console.log('Password updated for existing admin user.')
    } else {
      // Create new admin user
      await client.query(
        `INSERT INTO admin_users (email, password_hash, name, role, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, passwordHash, name, role, true]
      )
      console.log('Admin user created successfully!')
    }

    client.release()

    console.log('\n=== Admin User Details ===')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Name: ${name}`)
    console.log(`Role: ${role}`)
    console.log('\nYou can now login to the admin panel at /admin')
    
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the script
createAdminUser()