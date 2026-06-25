#!/usr/bin/env npx tsx

import { pool } from '../lib/database'

async function assignCategoriesToServices() {
  console.log('🔄 Assigning Categories to Existing Services...\n')

  const client = await pool.connect()

  try {
    // Get all services that don't have category assignments
    const unassignedServices = await client.query(`
      SELECT s.id, s.title, s.service_category, s.content
      FROM services s
      WHERE s.category_id IS NULL AND s.is_active = true
    `)

    console.log(`Found ${unassignedServices.rows.length} services without category assignments`)

    // Get available categories
    const categories = await client.query(`
      SELECT id, name, slug FROM service_categories WHERE is_active = true
    `)

    // Create mapping of keywords to category IDs
    const categoryMappings = [
      {
        id: categories.rows.find(c => c.slug === 'translation')?.id,
        keywords: ['translation', 'translate', 'linguistic', 'language', 'document', 'certified', 'notarized'],
        name: 'Translation Services'
      },
      {
        id: categories.rows.find(c => c.slug === 'legal')?.id,
        keywords: ['legal', 'law', 'court', 'contract', 'litigation', 'attorney', 'judicial'],
        name: 'Legal Services'
      },
      {
        id: categories.rows.find(c => c.slug === 'technical')?.id,
        keywords: ['technical', 'engineering', 'manual', 'specification', 'software', 'hardware'],
        name: 'Technical Services'
      },
      {
        id: categories.rows.find(c => c.slug === 'business')?.id,
        keywords: ['business', 'corporate', 'commercial', 'financial', 'marketing', 'consulting'],
        name: 'Business Solutions'
      },
      {
        id: categories.rows.find(c => c.slug === 'digital')?.id,
        keywords: ['digital', 'website', 'web', 'online', 'platform', 'app', 'software'],
        name: 'Digital Services'
      }
    ]

    let assignedCount = 0

    for (const service of unassignedServices.rows) {
      let bestMatch = null
      let bestScore = 0

      // Analyze service title and content for category keywords
      const searchText = `${service.title} ${service.content} ${service.service_category || ''}`.toLowerCase()

      for (const mapping of categoryMappings) {
        if (!mapping.id) continue

        const score = mapping.keywords.reduce((acc, keyword) => {
          const matches = (searchText.match(new RegExp(keyword, 'g')) || []).length
          return acc + matches
        }, 0)

        if (score > bestScore) {
          bestScore = score
          bestMatch = mapping
        }
      }

      // Assign category based on best match or fallback logic
      let categoryId = null

      if (bestMatch && bestScore > 0) {
        categoryId = bestMatch.id
        console.log(`📎 "${service.title}" → ${bestMatch.name} (score: ${bestScore})`)
      } else {
        // Fallback: assign based on legacy service_category field
        if (service.service_category) {
          const legacyMapping = categoryMappings.find(m => 
            m.name.toLowerCase().includes(service.service_category.toLowerCase()) ||
            service.service_category.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])
          )
          if (legacyMapping) {
            categoryId = legacyMapping.id
            console.log(`📎 "${service.title}" → ${legacyMapping.name} (legacy mapping)`)
          }
        }

        // Final fallback: assign to Translation Services (most common)
        if (!categoryId) {
          categoryId = categories.rows.find(c => c.slug === 'translation')?.id
          console.log(`📎 "${service.title}" → Translation Services (default)`)
        }
      }

      if (categoryId) {
        await client.query(
          'UPDATE services SET category_id = $1 WHERE id = $2',
          [categoryId, service.id]
        )
        assignedCount++
      }
    }

    console.log(`\n✅ Successfully assigned categories to ${assignedCount} services`)

    // Verify assignments
    const verification = await client.query(`
      SELECT s.title, sc.name as category_name, sc.slug, sc.color
      FROM services s
      JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.is_active = true
      ORDER BY sc.sort_order, s.title
    `)

    console.log('\n📊 Final Service-Category Assignments:')
    verification.rows.forEach(row => {
      console.log(`   ${row.title} → ${row.category_name}`)
    })

  } catch (error) {
    console.error('❌ Error assigning categories:', error)
    throw error
  } finally {
    client.release()
  }
}

// Run the assignment
assignCategoriesToServices()
  .then(() => {
    console.log('\n🎉 Category assignment completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Category assignment failed:', error)
    process.exit(1)
  })
