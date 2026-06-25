'use client'

import React, { useState, useCallback } from 'react'
import {
  useInput,
  useTranslate,
  InputProps,
} from 'react-admin'
import { 
  Box, 
  Typography, 
  Alert, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import { ImageUploadInput } from './ImageUploadInput'
import VideoUploadInput from './VideoUploadInput'

interface MediaUploadInputProps extends Omit<InputProps, 'source'> {
  source: string
  label?: string
  helperText?: string
  showPreview?: boolean
  showMetadata?: boolean
  defaultMediaType?: 'image' | 'video'
  imageAccept?: string
  videoAccept?: string
  maxImageSize?: number
  maxVideoSize?: number
}

export const MediaUploadInput: React.FC<MediaUploadInputProps> = ({
  source,
  label,
  helperText,
  showPreview = true,
  showMetadata = true,
  defaultMediaType = 'image',
  imageAccept = 'image/*',
  videoAccept = 'video/*',
  maxImageSize = 10, // 10MB
  maxVideoSize = 100, // 100MB
  validate,
  ...props
}) => {
  const translate = useTranslate()
  const [mediaType, setMediaType] = useState<'image' | 'video'>(defaultMediaType)
  
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source, validate, ...props })

  const handleMediaTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newMediaType = event.target.value as 'image' | 'video'
    setMediaType(newMediaType)
    
    // Clear the current value when switching media types
    if (value) {
      onChange('')
    }
  }, [value, onChange])

  const getMediaTypeFromUrl = (url: string): 'image' | 'video' => {
    if (!url) return mediaType
    
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    
    const extension = url.split('.').pop()?.toLowerCase()
    
    if (extension && videoExtensions.includes(extension)) {
      return 'video'
    } else if (extension && imageExtensions.includes(extension)) {
      return 'image'
    }
    
    return mediaType
  }

  // Auto-detect media type from existing value
  React.useEffect(() => {
    if (value) {
      const detectedType = getMediaTypeFromUrl(value)
      if (detectedType !== mediaType) {
        setMediaType(detectedType)
      }
    }
  }, [value, mediaType])

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label || translate(`resources.${source}.fields.${source}`)}
      </Typography>

      {/* Media Type Selection */}
      <Card sx={{ mb: 2, backgroundColor: 'grey.50' }}>
        <CardContent sx={{ py: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Media Type</Typography>
            </FormLabel>
            <RadioGroup
              row
              value={mediaType}
              onChange={handleMediaTypeChange}
            >
              <FormControlLabel
                value="image"
                control={<Radio size="small" />}
                label="Image"
              />
              <FormControlLabel
                value="video"
                control={<Radio size="small" />}
                label="Video"
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Conditional Media Upload */}
      {mediaType === 'image' ? (
        <ImageUploadInput
          source={source}
          label="Upload Image"
          accept={imageAccept}
          helperText={`Upload an image file (max ${maxImageSize}MB). Recommended: 1920x1080px for optimal display.`}
          showPreview={showPreview}
          showMetadata={showMetadata}
          validate={validate}
          {...props}
        />
      ) : (
        <VideoUploadInput
          source={source}
          label="Upload Video"
          accept={videoAccept}
          helperText={`Upload a video file (max ${maxVideoSize}MB). Supported formats: MP4, WebM, OGG.`}
          showPreview={showPreview}
          showMetadata={showMetadata}
          maxFileSize={maxVideoSize}
          validate={validate}
          {...props}
        />
      )}

      {/* General Helper Text */}
      {helperText && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {helperText}
        </Alert>
      )}

      {/* Media Type Guidelines */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          <strong>Image Guidelines:</strong> Use high-quality images (1920x1080px recommended) for best results. 
          Supported formats: JPG, PNG, WebP, GIF.
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          <strong>Video Guidelines:</strong> Keep videos under {maxVideoSize}MB for optimal loading. 
          Videos will autoplay muted by default for better user experience.
        </Typography>
      </Box>

      {/* Validation Error */}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error.message}
        </Typography>
      )}
    </Box>
  )
}

export default MediaUploadInput