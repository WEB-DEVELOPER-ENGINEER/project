'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
  FormDataConsumer,
} from 'react-admin'
import { ImageUploadInput } from '../ImageUploadInput'
import VideoUrlInput from '../VideoUrlInput'
import { CKEditorInput } from '../CKEditorInput'
import { Box, Grid, Typography, Divider } from '@mui/material'

export const SlidersCreate = () => (
  <Create>
    <SimpleForm>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextInput 
            source="title" 
            validate={[required()]} 
            fullWidth
            helperText="Enter a compelling title for your slider"
          />
          <CKEditorInput 
            source="description" 
            validate={[required()]} 
            helperText="Provide a detailed description that will appear on the slider"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Media Content
        </Typography>
        
        {/* Media Type Selection */}
        <SelectInput
          source="media_type"
          choices={[
            { id: 'image', name: 'Image' },
            { id: 'video', name: 'Video' },
          ]}
          defaultValue="image"
          validate={[required()]}
          helperText="Choose whether to use an image or video for this slider"
        />

        <FormDataConsumer>
          {({ formData }) => (
            <Box sx={{ mt: 2 }}>
              {formData.media_type === 'image' ? (
                <>
                  <ImageUploadInput
                    source="image_url"
                    label="Slider Image"
                    accept="image/*"
                    helperText="Upload a high-quality image for your slider (recommended: 1920x1080px)"
                    showPreview={true}
                    showMetadata={true}
                  />
                  <TextInput
                    source="media_alt_text"
                    label="Alt Text"
                    fullWidth
                    helperText="Describe the image for accessibility (required for SEO)"
                    validate={[required()]}
                  />
                </>
              ) : (
                <>
                  <VideoUrlInput
                    source="video_url"
                    label="Video URL"
                    helperText="Enter a YouTube, Vimeo, or direct video URL. This improves page load speed and SEO performance."
                    showPreview={true}
                    showMetadata={true}
                    validate={[required()]}
                  />
                  <TextInput
                    source="video_thumbnail_url"
                    label="Custom Thumbnail URL"
                    fullWidth
                    helperText="Optional: Override the auto-generated thumbnail with a custom image URL"
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    <SelectInput
                      source="video_platform"
                      label="Video Platform"
                      choices={[
                        { id: 'youtube', name: 'YouTube' },
                        { id: 'vimeo', name: 'Vimeo' },
                        { id: 'direct', name: 'Direct URL' },
                        { id: 'wistia', name: 'Wistia' },
                        { id: 'brightcove', name: 'Brightcove' },
                      ]}
                      helperText="Auto-detected from URL, can be manually overridden"
                    />
                    <SelectInput
                      source="video_quality"
                      label="Video Quality"
                      choices={[
                        { id: 'auto', name: 'Auto' },
                        { id: 'sd', name: 'Standard (480p)' },
                        { id: 'hd', name: 'HD (720p)' },
                        { id: '4k', name: '4K (2160p)' },
                      ]}
                      defaultValue="hd"
                      helperText="Preferred video quality for playback"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    <BooleanInput
                      source="video_autoplay"
                      label="Autoplay Video"
                      defaultValue={false}
                      helperText="Videos will be muted if autoplay is enabled"
                    />
                    <BooleanInput
                      source="video_muted"
                      label="Muted by Default"
                      defaultValue={true}
                      helperText="Recommended for autoplay videos"
                    />
                    <BooleanInput
                      source="video_loop"
                      label="Loop Video"
                      defaultValue={true}
                      helperText="Video will restart when it ends"
                    />
                    <BooleanInput
                      source="video_privacy_mode"
                      label="Privacy Enhanced Mode"
                      defaultValue={true}
                      helperText="Use privacy-enhanced embedding (YouTube only)"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <NumberInput
                      source="video_start_time"
                      label="Start Time (seconds)"
                      defaultValue={0}
                      helperText="Start playback at specific time"
                    />
                    <NumberInput
                      source="video_end_time"
                      label="End Time (seconds)"
                      helperText="End playback at specific time (optional)"
                    />
                  </Box>
                  <TextInput
                    source="media_alt_text"
                    label="Video Description"
                    fullWidth
                    helperText="Describe the video content for accessibility"
                    validate={[required()]}
                  />
                </>
              )}
              
              <TextInput
                source="media_caption"
                label="Media Caption"
                fullWidth
                multiline
                rows={2}
                helperText="Optional caption to display with the media"
              />
            </Box>
          )}
        </FormDataConsumer>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Display Settings
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <NumberInput 
            source="sort_order" 
            label="Sort Order"
            helperText="Lower numbers appear first"
            defaultValue={0}
          />
          <BooleanInput 
            source="is_active" 
            label="Active"
            defaultValue={true}
            helperText="Only active sliders will be displayed"
          />
          <BooleanInput 
            source="lazy_loading" 
            label="Enable Lazy Loading"
            defaultValue={true}
            helperText="Improves page load performance"
          />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
)