'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  useInput,
  useTranslate,
  InputProps,
} from 'react-admin'
import { 
  Box, 
  Typography, 
  Alert, 
  TextField,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { 
  VideoLibrary, 
  PlayArrow, 
  Pause,
  CheckCircle, 
  Error as ErrorIcon,
  Info,
  YouTube,
  Movie,
  ExpandMore,
  Preview,
  Settings
} from '@mui/icons-material'

interface VideoUrlInputProps extends Omit<InputProps, 'source'> {
  source: string
  label?: string
  helperText?: string
  showPreview?: boolean
  showMetadata?: boolean
  placeholder?: string
}

interface VideoMetadata {
  platform?: string
  embedId?: string
  quality?: string
  startTime?: number
  endTime?: number
  privacyMode?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  altText?: string
  caption?: string
  thumbnailUrl?: string
}

interface VideoValidation {
  isValid: boolean
  platform?: string
  embedId?: string
  error?: string
  thumbnailUrl?: string
}

export const VideoUrlInput: React.FC<VideoUrlInputProps> = ({
  source,
  label,
  helperText,
  showPreview = true,
  showMetadata = true,
  placeholder = "Enter video URL (YouTube, Vimeo, or direct link)",
  validate,
  ...props
}) => {
  const translate = useTranslate()
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    quality: 'hd',
    startTime: 0,
    privacyMode: true,
    autoplay: false,
    muted: true,
    loop: true
  })
  const [validation, setValidation] = useState<VideoValidation>({ isValid: true })
  const [isPlaying, setIsPlaying] = useState(false)
  
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source, validate, ...props })

  // Video URL validation and metadata extraction
  const validateVideoUrl = useCallback((url: string): VideoValidation => {
    if (!url) {
      return { isValid: true }
    }

    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    
    if (youtubeMatch) {
      const embedId = youtubeMatch[1]
      return {
        isValid: true,
        platform: 'youtube',
        embedId,
        thumbnailUrl: `https://img.youtube.com/vi/${embedId}/maxresdefault.jpg`
      }
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
    const vimeoMatch = url.match(vimeoRegex)
    
    if (vimeoMatch) {
      const embedId = vimeoMatch[1]
      return {
        isValid: true,
        platform: 'vimeo',
        embedId,
        thumbnailUrl: `https://vumbnail.com/${embedId}.jpg`
      }
    }

    // Direct video URL patterns
    const directVideoRegex = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i
    if (directVideoRegex.test(url) || url.startsWith('/uploads/')) {
      return {
        isValid: true,
        platform: 'direct',
        embedId: url
      }
    }

    // Generic HTTP/HTTPS URLs
    const urlRegex = /^https?:\/\/.+/
    if (urlRegex.test(url)) {
      return {
        isValid: true,
        platform: 'direct',
        embedId: url
      }
    }

    return {
      isValid: false,
      error: 'Invalid video URL. Please enter a valid YouTube, Vimeo, or direct video URL.'
    }
  }, [])

  // Normalize URL by adding protocol if missing
  const normalizeUrl = useCallback((url: string): string => {
    if (!url) return url;
    
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    
    return url;
  }, []);

  // Handle URL change and validation
  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = event.target.value
    const normalizedUrl = normalizeUrl(inputUrl)
    
    // Save the normalized URL (with protocol)
    onChange(normalizedUrl)
    
    const validationResult = validateVideoUrl(normalizedUrl)
    setValidation(validationResult)
    
    if (validationResult.isValid && validationResult.platform) {
      setVideoMetadata(prev => ({
        ...prev,
        platform: validationResult.platform,
        embedId: validationResult.embedId,
        thumbnailUrl: validationResult.thumbnailUrl
      }))
    }
  }, [onChange, validateVideoUrl, normalizeUrl])

  // Initialize validation on mount
  useEffect(() => {
    if (value) {
      const normalizedValue = normalizeUrl(value)
      const validationResult = validateVideoUrl(normalizedValue)
      setValidation(validationResult)
      
      if (validationResult.isValid && validationResult.platform) {
        setVideoMetadata(prev => ({
          ...prev,
          platform: validationResult.platform,
          embedId: validationResult.embedId,
          thumbnailUrl: validationResult.thumbnailUrl
        }))
      }
    }
  }, [value, validateVideoUrl, normalizeUrl])

  // Generate embed URL for preview
  const getEmbedUrl = useCallback((url: string, metadata: VideoMetadata): string => {
    if (!validation.isValid || !validation.platform) return ''

    switch (validation.platform) {
      case 'youtube':
        const youtubeParams = new URLSearchParams()
        if (metadata.autoplay) youtubeParams.set('autoplay', '1')
        if (metadata.muted) youtubeParams.set('mute', '1')
        if (metadata.loop) youtubeParams.set('loop', '1')
        if (metadata.startTime) youtubeParams.set('start', metadata.startTime.toString())
        if (metadata.endTime) youtubeParams.set('end', metadata.endTime.toString())
        if (metadata.privacyMode) {
          return `https://www.youtube-nocookie.com/embed/${validation.embedId}?${youtubeParams.toString()}`
        }
        return `https://www.youtube.com/embed/${validation.embedId}?${youtubeParams.toString()}`
      
      case 'vimeo':
        const vimeoParams = new URLSearchParams()
        if (metadata.autoplay) vimeoParams.set('autoplay', '1')
        if (metadata.muted) vimeoParams.set('muted', '1')
        if (metadata.loop) vimeoParams.set('loop', '1')
        if (metadata.startTime) vimeoParams.set('t', `${metadata.startTime}s`)
        return `https://player.vimeo.com/video/${validation.embedId}?${vimeoParams.toString()}`
      
      case 'direct':
        return validation.embedId || url
      
      default:
        return url
    }
  }, [validation])

  // Get platform icon
  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTube color="error" />
      case 'vimeo':
        return <VideoLibrary color="primary" />
      case 'direct':
        return <Movie color="action" />
      default:
        return <VideoLibrary />
    }
  }

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label || translate(`resources.${source}.fields.${source}`)}
      </Typography>

      {/* URL Input */}
      <TextField
        fullWidth
        value={value || ''}
        onChange={handleUrlChange}
        placeholder={placeholder}
        error={!validation.isValid || !!error}
        helperText={validation.error || error?.message}
        InputProps={{
          startAdornment: validation.platform && (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              {getPlatformIcon(validation.platform)}
            </Box>
          ),
          endAdornment: validation.isValid && value && (
            <CheckCircle color="success" />
          )
        }}
        sx={{ mb: 2 }}
      />

      {/* Platform Detection */}
      {validation.isValid && validation.platform && value && (
        <Alert 
          severity="success" 
          icon={getPlatformIcon(validation.platform)}
          sx={{ mb: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              Detected: {validation.platform.charAt(0).toUpperCase() + validation.platform.slice(1)} video
            </Typography>
            {validation.platform !== 'direct' && (
              <Chip 
                label={`ID: ${validation.embedId}`} 
                size="small" 
                variant="outlined" 
              />
            )}
          </Box>
        </Alert>
      )}

      {/* Video Preview */}
      {showPreview && validation.isValid && value && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Preview /> Video Preview
            </Typography>
            
            {validation.platform === 'direct' ? (
              <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: 'black', borderRadius: 1 }}>
                <video
                  src={normalizeUrl(value)}
                  controls
                  muted={videoMetadata.muted}
                  loop={videoMetadata.loop}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '4px'
                  }}
                  onError={() => setValidation(prev => ({ ...prev, isValid: false, error: 'Failed to load video. Please check the URL format.' }))}
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: 'black', borderRadius: 1 }}>
                <iframe
                  src={getEmbedUrl(value, videoMetadata)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Preview"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advanced Settings */}
      {showMetadata && validation.isValid && value && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings />
              <Typography variant="subtitle2">Advanced Video Settings</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Video Quality */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Video Quality</InputLabel>
                  <Select
                    value={videoMetadata.quality || 'hd'}
                    onChange={(e) => setVideoMetadata(prev => ({ ...prev, quality: e.target.value }))}
                    label="Video Quality"
                  >
                    <MenuItem value="auto">Auto</MenuItem>
                    <MenuItem value="sd">Standard (480p)</MenuItem>
                    <MenuItem value="hd">HD (720p)</MenuItem>
                    <MenuItem value="4k">4K (2160p)</MenuItem>
                  </Select>
                </FormControl>

                {/* Privacy Mode (for YouTube) */}
                {validation.platform === 'youtube' && (
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={videoMetadata.privacyMode || false}
                          onChange={(e) => setVideoMetadata(prev => ({ ...prev, privacyMode: e.target.checked }))}
                        />
                      }
                      label="Privacy Enhanced Mode"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Uses youtube-nocookie.com for better privacy
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Playback Settings */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>Playback Settings</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.autoplay || false}
                        onChange={(e) => setVideoMetadata(prev => ({ ...prev, autoplay: e.target.checked }))}
                      />
                    }
                    label="Autoplay"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.muted || false}
                        onChange={(e) => setVideoMetadata(prev => ({ ...prev, muted: e.target.checked }))}
                      />
                    }
                    label="Muted"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoMetadata.loop || false}
                        onChange={(e) => setVideoMetadata(prev => ({ ...prev, loop: e.target.checked }))}
                      />
                    }
                    label="Loop"
                  />
                </Box>
              </Box>

              {/* Time Controls */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Start Time (seconds)"
                  type="number"
                  value={videoMetadata.startTime || 0}
                  onChange={(e) => setVideoMetadata(prev => ({ ...prev, startTime: parseInt(e.target.value) || 0 }))}
                  size="small"
                  helperText="Start playback at specific time"
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label="End Time (seconds)"
                  type="number"
                  value={videoMetadata.endTime || ''}
                  onChange={(e) => setVideoMetadata(prev => ({ ...prev, endTime: parseInt(e.target.value) || undefined }))}
                  size="small"
                  helperText="End playback at specific time (optional)"
                  sx={{ minWidth: 200 }}
                />
              </Box>

              {/* Accessibility */}
              <TextField
                fullWidth
                label="Video Description (Alt Text)"
                value={videoMetadata.altText || ''}
                onChange={(e) => setVideoMetadata(prev => ({ ...prev, altText: e.target.value }))}
                size="small"
                helperText="Describe the video content for screen readers"
              />
              <TextField
                fullWidth
                label="Caption"
                value={videoMetadata.caption || ''}
                onChange={(e) => setVideoMetadata(prev => ({ ...prev, caption: e.target.value }))}
                size="small"
                multiline
                rows={2}
                helperText="Optional caption to display with the video"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Helper Text */}
      {helperText && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {helperText}
        </Alert>
      )}

      {/* URL Guidelines */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          <strong>Supported Platforms:</strong> YouTube, Vimeo, direct video URLs (.mp4, .webm, .ogg)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          <strong>SEO Benefits:</strong> External video URLs improve page load speed and reduce server storage costs
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          <strong>Examples:</strong> https://www.youtube.com/watch?v=VIDEO_ID, https://vimeo.com/VIDEO_ID, your-domain.supabase.co/storage/...
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          <strong>Note:</strong> URLs without https:// will be automatically prefixed for security
        </Typography>
      </Box>
    </Box>
  )
}

export default VideoUrlInput