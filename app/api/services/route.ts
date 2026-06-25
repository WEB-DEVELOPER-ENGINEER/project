import { NextRequest, NextResponse } from 'next/server'
import { getServices, getServiceCategories } from '@/lib/data-access'

// API route for frontend service filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined

    // If no filters, return all services and categories
    if (!categorySlug && !categoryId) {
      const [services, categories] = await Promise.all([
        getServices(),
        getServiceCategories()
      ])
      
      return NextResponse.json({
        success: true,
        data: {
          services,
          categories,
          total: services.length
        }
      })
    }

    // Get filtered services
    const services = await getServices(categoryId, categorySlug)
    
    return NextResponse.json({
      success: true,
      data: {
        services,
        total: services.length,
        filter: categorySlug || categoryId
      }
    })
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch services' 
      }, 
      { status: 500 }
    )
  }
}
