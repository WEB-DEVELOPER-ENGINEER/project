'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  UrlField,
  NumberField,
  RichTextField,
  FunctionField,
} from 'react-admin'
import { Box, Typography, Chip, Grid, Card, CardContent, Divider } from '@mui/material'
import { Image as ImageIcon, VideoLibrary } from '@mui/icons-material'

export const SlidersShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      
      {/* Basic Information */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Basic Information
      </Typography>
      <TextField source="title" />
      <RichTextField source="description" />
      
      {/* Media Information */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Media Content
      </Typography>
      
      <FunctionField
        label="Media Type"
        render={(record: any) => (
          <Chip
            icon={record.media_type === 'video' ? <VideoLibrary /> : <ImageIcon />}
            label={record.media_type === 'video' ? 'Video' : 'Image'}
            color={record.media_type === 'video' ? 'secondary' : 'primary'}
            variant="outlined"
          />
        )}
      />
      
      <FunctionField
        label="Media Preview"
        render={(record: any) => (
          <Box sx={{ mt: 2, mb: 2 }}>
            {record.media_type === 'video' ? (
              <Box>
                <video
                  src={record.video_url}
                  poster={record.video_thumbnail_url}
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px'
                  }}
                  muted={record.video_muted}
                  loop={record.video_loop}
                />
                {record.video_duration && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Duration: {Math.floor(record.video_duration / 60)}:{(record.video_duration % 60).toString().padStart(2, '0')}
                  </Typography>
                )}
              </Box>
            ) : record.image_url ? (
              <img
                src={record.image_url}
                alt={record.media_alt_text || record.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Typography color="text.secondary">No media uploaded</Typography>
            )}
          </Box>
        )}
      />
      
      <UrlField source="image_url" label="Image URL" />
      <UrlField source="video_url" label="Video URL" />
      <UrlField source="video_thumbnail_url" label="Video Thumbnail URL" />
      <TextField source="media_alt_text" label="Alt Text / Description" />
      <TextField source="media_caption" label="Media Caption" />
      
      {/* Video Settings */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Video Settings
      </Typography>
      <NumberField source="video_duration" label="Duration (seconds)" />
      <BooleanField source="video_autoplay" label="Autoplay" />
      <BooleanField source="video_muted" label="Muted" />
      <BooleanField source="video_loop" label="Loop" />
      
      {/* Display Settings */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Display Settings
      </Typography>
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <BooleanField source="lazy_loading" label="Lazy Loading Enabled" />
      
      {/* Metadata */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Metadata
      </Typography>
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </SimpleShowLayout>
  </Show>
)