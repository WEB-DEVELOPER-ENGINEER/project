/**
 * Data validation utilities for React Admin
 * Ensures proper data structure and field validation
 */

export interface ReactAdminRecord {
  id: string | number
  [key: string]: any
}

export interface ReactAdminListResponse {
  data: ReactAdminRecord[]
  total: number
}

export interface ReactAdminSingleResponse {
  data: ReactAdminRecord
}

/**
 * Validates and normalizes a list response for React Admin
 */
export function validateListResponse(response: any): ReactAdminListResponse {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format: Expected object')
  }

  const { data, total } = response

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format: data must be an array')
  }

  if (typeof total !== 'number' || total < 0) {
    console.warn('Invalid total count, defaulting to data length')
  }

  const normalizedData = data.map((item: any, index: number) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid data item at index ${index}: Expected object`)
    }

    // Ensure id field exists
    if (!item.id && item.id !== 0) {
      if (item._id) {
        item.id = item._id
      } else {
        console.warn(`Data item at index ${index} missing id field, using index as fallback`)
        item.id = index
      }
    }

    return {
      id: item.id,
      ...item
    }
  })

  return {
    data: normalizedData,
    total: typeof total === 'number' && total >= 0 ? total : normalizedData.length
  }
}

/**
 * Validates and normalizes a single record response for React Admin
 */
export function validateSingleResponse(response: any): ReactAdminSingleResponse {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format: Expected object')
  }

  const { data } = response

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format: data must be an object')
  }

  // Ensure id field exists
  if (!data.id && data.id !== 0) {
    if (data._id) {
      data.id = data._id
    } else {
      throw new Error('Data item missing required id field')
    }
  }

  return {
    data: {
      id: data.id,
      ...data
    }
  }
}

/**
 * Validates API error responses and provides user-friendly messages
 */
export function validateErrorResponse(error: any): string {
  if (!error) {
    return 'An unknown error occurred'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error.message) {
    return error.message
  }

  if (error.body && typeof error.body === 'object') {
    if (error.body.error) {
      return error.body.error
    }
    if (error.body.message) {
      return error.body.message
    }
  }

  return 'An unexpected error occurred'
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .substring(0, 1000) // Limit length
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (input && typeof input === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      if (key.length <= 100) { // Limit key length
        sanitized[key] = sanitizeInput(value)
      }
    }
    return sanitized
  }

  return input
}
