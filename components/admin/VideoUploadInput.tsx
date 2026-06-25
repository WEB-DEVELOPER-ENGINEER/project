'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  useInput,
  useTranslate,
  InputProps,
} from 'react-admin'
import { 
  Box, 
  Typography, 
  Alert, 
  LinearProgress, 
  Chip, 
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material'
import { 
  CloudUpload, 
  VideoLibrary, 
  PlayArrow, 
  Pause,
  Delete,
  CheckCircle, 
  Error as ErrorIcon,
  Info
} from '@mui/icons-material'

interface VideoUploadInputProps extends Omit<InputProps, 'source'> {
  source: string
  label?: string
  accept?: string
  helperText?: string
  showPreview?: boolean
  showMetadata?: boolean
  placeholder?: string
  maxFileSize?: number // in MB
  allowedFormats?: string[]
}

interface UploadStatus {
  uploading: boolean
  progress: number
  error?: string
  success?: boolean
}

interface VideoMetadata {
  duration?: number
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  thumbnail_url?: string
  alt_text?: string
  caption?: string
}

export const VideoUploadInput: React.FC<VideoUploadInputProps> = ({
  source,
  label,
  accept = 'video/*',
  helperText,
  showPreview = true,
  showMetadata = true,
  placeholder,
  maxFileSize = 100, // 100MB default
  allowedFormats = ['mp4', 'webm', 'ogg', 'mov'],
  validate,
  ...props
}) => {
  const translate = useTranslate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
  })
  
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    autoplay: false,
    muted: true,
    loop: true,
  })
  
  const [isPlaying, setIsPlaying] = useState(false)
  
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source, validate, ...props })

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`
      })
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: `File size too large. Maximum size: ${maxFileSize}MB`
      })
      return
    }

    setUploadStatus({ uploading: true, progress: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      if (result.success) {
        // Extract video metadata
        const video = document.createElement('video')
        video.src = URL.createObjectURL(file)
        video.onloadedmetadata = () => {
          setVideoMetadata(prev => ({
            ...prev,
            duration: Math.round(video.duration)
          }))
          URL.revokeObjectURL(video.src)
        }
        
        onChange(result.file_url)
        setUploadStatus({
          uploading: false,
          progress: 100,
          success: true
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      })
    }
  }, [allowedFormats, maxFileSize, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    onChange('')
    setUploadStatus({ uploading: false, progress: 0 })
    setVideoMetadata({
      autoplay: false,
      muted: true,
      loop: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label || translate(`resources.${source}.fields.${source}`)}
      </Typography>

      {/* Upload Area */}
      {!value && (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <VideoLibrary sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            {placeholder || 'Upload Video'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Drag and drop a video file here, or click to select
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: {allowedFormats.join(', ')} • Max size: {maxFileSize}MB
          </Typography>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </Box>
      )}

      {/* Upload Progress */}
      {uploadStatus.uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadStatus.progress} />
          <Typography variant="caption" color="text.secondary">
            Uploading... {uploadStatus.progress}%
          </Typography>
        </Box>
      )}

      {/* Upload Status Messages */}
      {uploadStatus.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <ErrorIcon sx={{ mr: 1 }} />
          {uploadStatus.error}
        </Alert>
      )}

      {uploadStatus.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <CheckCircle sx={{ mr: 1 }} />
          Video uploaded successfully!
        </Alert>
      )}

      {/* Video Preview */}
      {value && showPreview && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <video
                ref={videoRef}
                src={value}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px'
                }}
                controls={false}
                muted={videoMetadata.muted}
                loop={videoMetadata.loop}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement
                  setVideoMetadata(prev => ({
                    ...prev,
                    duration: Math.round(video.duration)
                  }))
                }}
              />
              
              {/* Play/Pause Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <IconButton
                  onClick={togglePlayPause}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Box>

              {/* Remove Button */}
              <IconButton
                onClick={handleRemove}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>

            {/* Video Metadata */}
            {showMetadata && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Video Settings
                </Typography>
                
                {videoMetadata.duration && (
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={<Info />}
                      label={`Duration: ${formatDuration(videoMetadata.duration)}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.autoplay || false}
                        onChange={(e) => setVideoMetadata(prev => ({
                          ...prev,
                          autoplay: e.target.checked
                        }))}
                        size="small"
                      />
                    }
                    label="Autoplay"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.muted || false}
                        onChange={(e) => setVideoMetadata(prev => ({
                          ...prev,
                          muted: e.target.checked
                        }))}
                        size="small"
                      />
                    }
                    label="Muted"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.loop || false}
                        onChange={(e) => setVideoMetadata(prev => ({
                          ...prev,
                          loop: e.target.checked
                        }))}
                        size="small"
                      />
                    }
                    label="Loop"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Alt Text (for accessibility)"
                    value={videoMetadata.alt_text || ''}
                    onChange={(e) => setVideoMetadata(prev => ({
                      ...prev,
                      alt_text: e.target.value
                    }))}
                    size="small"
                    helperText="Describe the video content for screen readers"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Caption"
                    value={videoMetadata.caption || ''}
                    onChange={(e) => setVideoMetadata(prev => ({
                      ...prev,
                      caption: e.target.value
                    }))}
                    size="small"
                    multiline
                    rows={2}
                    helperText="Optional caption to display with the video"
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Helper Text */}
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {/* Validation Error */}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error.message}
        </Typography>
      )}
    </Box>
  )
}

export default VideoUploadInput