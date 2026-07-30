#!/usr/bin/env npx tsx

/**
 * Creates (or updates the password of) an admin user for the /admin panel.
 *
 * Connects to whichever database the app itself is configured to use (via
 * lib/database.ts, which reads DATABASE_URL / DB_* from .env.local/.env) —
 * so this targets your local dev database by default, not production.
 *
 * SECURITY: this script previously hardcoded a live remote Postgres host,
 * user, and plaintext password. That credential was committed to a public
 * repository and must be treated as compromised and rotated. Never
 * hardcode connection credentials here — set them via environment
 * variables instead.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='<strong-password>' npx tsx scripts/create-admin-user.ts
 */

import bcrypt from 'bcryptjs'
import { pool } from '../lib/database'

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@jusortrans.com'
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Admin User'
  const role = 'admin'

  if (!password) {
    console.error('❌ ADMIN_PASSWORD is required — refusing to create an admin user with a default/guessable password.')
    console.error("   Example: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='<strong-password>' npx tsx scripts/create-admin-user.ts")
    process.exit(1)
  }

  try {
    console.log('Connecting to the configured database...')
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
    console.log(`Name: ${name}`)
    console.log(`Role: ${role}`)
    console.log('Password: (as supplied via ADMIN_PASSWORD — not echoed)')
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