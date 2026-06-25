'use client'

import React, { useState, useCallback } from 'react'
import {
  useInput,
  useDataProvider,
  useNotify,
  InputProps,
} from 'react-admin'
import { 
  Box, 
  Typography, 
  Button, 
  LinearProgress, 
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Alert
} from '@mui/material'
import { 
  CloudUpload, 
  Delete, 
  Image as ImageIcon,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material'

interface SimpleImageUploadProps extends Omit<InputProps, 'source'> {
  source: string
  label?: string
  accept?: string
  helperText?: string
  showPreview?: boolean
  showMetadata?: boolean
  placeholder?: string
  maxSize?: number // in MB
}

interface UploadStatus {
  uploading: boolean
  progress: number
  error?: string
  success?: boolean
}

export const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  source,
  label,
  accept = 'image/*',
  helperText,
  showPreview = true,
  showMetadata = true,
  placeholder,
  maxSize = 10,
  validate,
  ...props
}) => {
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
  })

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source, validate })

  const uploadFile = async (file: File): Promise<string> => {
    // Use React Admin's dataProvider for upload
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const options = {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        format: 'webp',
        generateThumbnail: true,
        thumbnailSize: 300,
        preserveOriginal: false,
      }
      formData.append('options', JSON.stringify(options))

      // Make direct authenticated request using fetch with proper session handling
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin', // Use same-origin for better session handling
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      if (!result.success || !result.data || !result.data.url) {
        throw new Error(result.error || 'Upload failed - no URL returned')
      }

      return result.data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const file = files[0]

      // Clear any previous errors
      setUploadStatus({ uploading: false, progress: 0 })

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const errorMsg = `File too large. Maximum size is ${maxSize}MB.`
        setUploadStatus({
          uploading: false,
          progress: 0,
          error: errorMsg,
        })
        notify(errorMsg, { type: 'error' })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorMsg = 'Please select an image file.'
        setUploadStatus({
          uploading: false,
          progress: 0,
          error: errorMsg,
        })
        notify(errorMsg, { type: 'error' })
        return
      }

      setUploadStatus({ uploading: true, progress: 0 })

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadStatus(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }))
        }, 200)

        const imageUrl = await uploadFile(file)

        clearInterval(progressInterval)

        // Validate the returned URL
        if (!imageUrl || typeof imageUrl !== 'string') {
          throw new Error('Invalid URL returned from server')
        }

        setUploadStatus({
          uploading: false,
          progress: 100,
          success: true,
        })

        // Set the URL string directly
        onChange(imageUrl)
        notify('Image uploaded successfully', { type: 'success' })

        // Clear success status after 2 seconds
        setTimeout(() => {
          setUploadStatus({ uploading: false, progress: 0 })
        }, 2000)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        setUploadStatus({
          uploading: false,
          progress: 0,
          error: errorMessage,
        })
        notify(`Image upload failed: ${errorMessage}`, { type: 'error' })
      }

      // Reset input
      event.target.value = ''
    },
    [maxSize, onChange, notify, uploadFile]
  )

  const handleRemove = useCallback(() => {
    onChange('')
    setUploadStatus({ uploading: false, progress: 0 })
  }, [onChange])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const fakeEvent = {
          target: { files }
        } as React.ChangeEvent<HTMLInputElement>
        handleFileSelect(fakeEvent)
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const renderUploadArea = () => (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        border: '2px dashed',
        borderColor: error ? 'error.main' : uploadStatus.uploading ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        backgroundColor: uploadStatus.uploading ? 'primary.50' : 'grey.50',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'primary.50',
        },
      }}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={`upload-${source}`}
        disabled={uploadStatus.uploading}
      />
      
      <label htmlFor={`upload-${source}`} style={{ cursor: 'pointer', display: 'block' }}>
        <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {placeholder || 'Drop image here or click to browse'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
        </Typography>
      </label>

      {uploadStatus.uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={uploadStatus.progress} 
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="textSecondary">
            Uploading... {uploadStatus.progress}%
          </Typography>
        </Box>
      )}

      {uploadStatus.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon />
            {uploadStatus.error}
          </Box>
        </Alert>
      )}

      {uploadStatus.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle />
            Upload successful!
          </Box>
        </Alert>
      )}
    </Box>
  )

  const renderPreview = () => {
    if (!value || typeof value !== 'string') return null

    return (
      <Card sx={{ maxWidth: 300, mt: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={value}
          alt="Uploaded image"
          sx={{ objectFit: 'cover' }}
        />
        <CardActions>
          <Button
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={handleRemove}
            disabled={uploadStatus.uploading}
          >
            Remove
          </Button>
          <Button
            size="small"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Size
          </Button>
        </CardActions>
        {showMetadata && (
          <Box sx={{ p: 1, backgroundColor: 'grey.100' }}>
            <Typography variant="caption" display="block">
              URL: {value}
            </Typography>
          </Box>
        )}
      </Card>
    )
  }

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
      )}
      
      {!value ? renderUploadArea() : showPreview && renderPreview()}
      
      {value && !showPreview && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {value}
          </Typography>
          <Button
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </Box>
      )}

      {helperText && (
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          {helperText}
        </Typography>
      )}

      {error && (
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'error.main' }}>
          {error.message}
        </Typography>
      )}
    </Box>
  )
}

export default SimpleImageUpload