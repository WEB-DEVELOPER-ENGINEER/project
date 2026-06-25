import { NextRequest, NextResponse } from 'next/server'

// Enhanced error handling utilities for admin APIs
export interface ApiError {
  message: string
  code?: string
  status: number
  details?: any
}

export class AdminApiError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AdminApiError'
  }
}

// Wrapper function for admin API routes with standardized error handling
export function withErrorHandler(
  handler: (request: NextRequest, params?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await handler(request, params)
    } catch (error: any) {
      console.error('API Error:', {
        url: request.url,
        method: request.method,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      })

      if (error instanceof AdminApiError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
            details: error.details,
          },
          { status: error.status }
        )
      }

      // Handle different types of errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.message },
          { status: 400 }
        )
      }

      if (error.code === '23505') { // PostgreSQL unique constraint violation
        return NextResponse.json(
          { error: 'Record already exists', details: 'Duplicate entry' },
          { status: 409 }
        )
      }

      if (error.code === '23503') { // PostgreSQL foreign key constraint violation
        return NextResponse.json(
          { error: 'Reference error', details: 'Related record not found' },
          { status: 400 }
        )
      }

      // Generic server error
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
        },
        { status: 500 }
      )
    }
  }
}

// Validation helper functions
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field] || data[field] === '')
  if (missing.length > 0) {
    throw new AdminApiError(
      `Missing required fields: ${missing.join(', ')}`,
      400,
      'VALIDATION_ERROR',
      { missingFields: missing }
    )
  }
}

export function validateIdParam(id: string): number {
  const numId = parseInt(id)
  if (isNaN(numId) || numId <= 0) {
    throw new AdminApiError('Invalid ID parameter', 400, 'INVALID_ID')
  }
  return numId
}

// Request parsing with validation
export async function parseJsonBody(request: NextRequest): Promise<any> {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      throw new AdminApiError('Invalid JSON body', 400, 'INVALID_JSON')
    }
    return body
  } catch (error: any) {
    if (error instanceof AdminApiError) throw error
    throw new AdminApiError('Failed to parse JSON body', 400, 'PARSE_ERROR')
  }
}

// Response helpers
export function successResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json({ data }, { status })
}

export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code,
      details,
    },
    { status }
  )
}
