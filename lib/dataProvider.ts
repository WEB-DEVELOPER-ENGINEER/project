import { DataProvider, fetchUtils } from 'react-admin'
import { getSession } from 'next-auth/react'
import { validateListResponse, validateSingleResponse, validateErrorResponse } from './dataValidation'

const apiUrl = '/api/admin'

// Custom HTTP client with NextAuth session authentication
const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }
  
  // Add Content-Type for POST/PUT requests
  if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
    options.headers.set('Content-Type', 'application/json')
  }
  
  // Get NextAuth session for authentication
  const session = await getSession()
  if (session?.user?.email) {
    // NextAuth handles authentication via session cookies automatically
    // No need to manually set Authorization headers
  }
  
  try {
    return await fetchUtils.fetchJson(url, options)
  } catch (error: any) {
    // Enhanced error handling
    console.error('HTTP Request Error:', {
      url,
      method: options.method || 'GET',
      status: error.status,
      message: error.message,
      body: error.body
    })
    
    // Log the actual response body for debugging
    if (error.body) {
      console.error('Error response body:', error.body)
    }
    
    // Re-throw with additional context
    throw error // Keep the original error object for React Admin
  }
}

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    // Handle dashboard resource specially
    if (resource === 'dashboard') {
      return httpClient(`${apiUrl}/dashboard`).then(({ json }) => {
        try {
          return validateListResponse({
            data: [{ id: 'dashboard', ...json.data }],
            total: 1,
          })
        } catch (error) {
          console.error('Dashboard data validation error:', error)
          return {
            data: [{ id: 'dashboard', ...json.data }],
            total: 1,
          }
        }
      })
    }

    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const query = {
      sort: field,
      order: order,
      page: page.toString(),
      perPage: perPage.toString(),
      filter: JSON.stringify(params.filter),
    }
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`

    return httpClient(url).then(({ headers, json }) => {
      try {
        return validateListResponse(json)
      } catch (error) {
        console.error('List data validation error:', error)
        // Fallback with manual validation
        const data = (json.data || []).map((item: any, index: number) => ({
          id: item.id || item._id || index,
          ...item,
        }))
        
        return {
          data,
          total: json.total || 0,
        }
      }
    }).catch((error) => {
      const message = validateErrorResponse(error)
      console.error('getList error:', message)
      throw new Error(message)
    })
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => {
      try {
        return validateSingleResponse(json)
      } catch (error) {
        console.error('Single record validation error:', error)
        return {
          data: { id: json.data.id || json.data._id || params.id, ...json.data },
        }
      }
    }).catch((error) => {
      const message = validateErrorResponse(error)
      console.error('getOne error:', message)
      throw new Error(message)
    }),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`
    return httpClient(url).then(({ json }) => ({
      data: (json.data || []).map((item: any, index: number) => ({
        id: item.id || item._id || params.ids[index] || index,
        ...item,
      })),
    }))
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const query = {
      sort: field,
      order: order,
      page: page.toString(),
      perPage: perPage.toString(),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    }
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`

    return httpClient(url).then(({ headers, json }) => ({
      data: (json.data || []).map((item: any, index: number) => ({
        id: item.id || item._id || index,
        ...item,
      })),
      total: json.total || 0,
    }))
  },

  update: (resource, params) => {
    // Handle password field for users
    if (resource === 'users' && params.data.password === '') {
      delete params.data.password
    }

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { id: json.data.id || json.data._id || params.id, ...json.data },
    }))
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }
    return httpClient(`${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: (json.data || []).map((item: any, index: number) => ({
        id: item.id || item._id || params.ids[index] || index,
        ...item,
      })),
    }))
  },

  create: (resource, params) => {
    // Auto-generate slug for resources that need it
    const slugResources = ['services', 'projects', 'blogs']
    if (slugResources.includes(resource) && params.data.title && !params.data.slug) {
      params.data.slug = params.data.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    return httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      const responseData = json.data
      return {
        data: {
          id: responseData.id || responseData._id || Date.now(), // Fallback to timestamp
          ...params.data,
          ...responseData,
        },
      }
    })
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({
      data: { id: json.data.id || json.data._id || params.id, ...json.data },
    })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }
    return httpClient(`${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`, {
      method: 'DELETE',
    }).then(({ json }) => ({
      data: (json.data || params.ids).map((item: any) => {
        if (typeof item === 'object') {
          return { id: item.id || item._id, ...item }
        }
        return { id: item }
      }),
    }))
  },
}