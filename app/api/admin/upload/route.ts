import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-api-utils'
import { processImage, validateImage, ImageUploadOptions } from '@/lib/image-upload-utils'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Video validation function
async function validateVideo(file: File) {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
  const maxSize = 100 * 1024 * 1024 // 100MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid video format. Allowed formats: ${allowedTypes.join(', ')}`
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Video file too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}

// Video processing function
async function processVideo(file: File) {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos')
  
  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `video_${timestamp}.${extension}`
  const filepath = join(uploadDir, filename)
  
  // Save file
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(filepath, buffer)
  
  const fileUrl = `/uploads/videos/${filename}`
  
  return {
    file_url: fileUrl,
    file_name: filename,
    file_size: file.size,
    original_name: file.name,
    mime_type: file.type
  }
}

export async function POST(request: NextRequest) {
  const { authorized } = await checkAuth()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image'
    const optionsJson = formData.get('options') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Handle video uploads
    if (type === 'video') {
      const validation = await validateVideo(file)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      const result = await processVideo(file)
      return NextResponse.json({
        success: true,
        ...result
      })
    }

    // Handle image uploads (existing logic)
    let uploadOptions: ImageUploadOptions = {}
    if (optionsJson) {
      try {
        uploadOptions = JSON.parse(optionsJson)
      } catch (error) {
        console.warn('Invalid upload options JSON, using defaults')
      }
    }

    // Validate the image
    const validation = await validateImage(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
      minWidth: 50,
      minHeight: 50,
      maxWidth: 4000,
      maxHeight: 4000,
    })

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Process and optimize the image
    const result = await processImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 300,
      preserveOriginal: false,
      ...uploadOptions,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        originalMetadata: validation.metadata,
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}