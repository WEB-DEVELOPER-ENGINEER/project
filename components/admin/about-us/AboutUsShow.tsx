'use client'

import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  DateField,
  BooleanField,
  EmailField,
  UrlField,
  NumberField,
  RichTextField,
  ImageField,
  ArrayField,
  Datagrid,
  FunctionField,
} from 'react-admin'

export const AboutUsShow = () => (
  <Show>
    <TabbedShowLayout>
      {/* Basic Information Tab */}
      <Tab label="Basic Info">
        <NumberField source="id" />
        <TextField source="title" />
        <TextField source="slogan" />
        <RichTextField source="description" />
        <BooleanField source="is_active" />
        <DateField source="created_at" showTime />
        <DateField source="updated_at" showTime />
      </Tab>

      {/* Hero Section Tab */}
      <Tab label="Hero Section">
        <ImageField source="hero_image_url" title="Hero Image" />
        <UrlField source="hero_video_url" />
        <TextField source="hero_cta_primary_text" />
        <UrlField source="hero_cta_primary_url" />
        <TextField source="hero_cta_secondary_text" />
        <UrlField source="hero_cta_secondary_url" />
      </Tab>

      {/* Mission & Vision Tab */}
      <Tab label="Mission & Vision">
        <RichTextField source="mission" />
        <RichTextField source="vision" />
        <RichTextField source="purpose" />
        <ImageField source="mission_image_url" title="Mission Image" />
      </Tab>

      {/* Company Story Tab */}
      <Tab label="Company Story">
        <RichTextField source="story" />
        <RichTextField source="story_continuation" />
        <ImageField source="story_image_url" title="Story Image" />
      </Tab>

      {/* Values Tab */}
      <Tab label="Values">
        <FunctionField 
          label="Company Values" 
          render={(record: any) => {
            if (!record.values) return 'No values defined';
            try {
              const values = JSON.parse(record.values);
              if (!Array.isArray(values)) return 'No values defined';
              return (
                <div>
                  {values.map((value: any, index: number) => (
                    <div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <strong>{value.title || 'Untitled'}</strong>
                      <p>{value.description || 'No description'}</p>
                      <small>Icon: {value.icon || 'None'} | Color: {value.color || 'Default'}</small>
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return 'Invalid values data';
            }
          }} 
        />
        <ImageField source="values_image_url" title="Values Image" />
      </Tab>

      {/* Timeline Tab */}
      <Tab label="Timeline">
        <FunctionField 
          label="Company Timeline" 
          render={(record: any) => {
            if (!record.timeline_phases) return 'No timeline defined';
            try {
              const phases = JSON.parse(record.timeline_phases);
              if (!Array.isArray(phases)) return 'No timeline defined';
              return (
                <div>
                  {phases.map((phase: any, index: number) => (
                    <div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <strong>{phase.year || 'Unknown'} - {phase.title || 'Untitled'}</strong>
                      <p>{phase.description || 'No description'}</p>
                      <small>Icon: {phase.icon || 'None'}</small>
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return 'Invalid timeline data';
            }
          }} 
        />
        <ImageField source="timeline_image_url" title="Timeline Image" />
      </Tab>

      {/* Achievements Tab */}
      <Tab label="Achievements">
        <FunctionField 
          label="Company Achievements" 
          render={(record: any) => {
            if (!record.achievements) return 'No achievements defined';
            try {
              const achievements = JSON.parse(record.achievements);
              if (!Array.isArray(achievements)) return 'No achievements defined';
              return (
                <div>
                  {achievements.map((achievement: any, index: number) => (
                    <div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <strong>{achievement.title || 'Untitled'}</strong>
                      <p>{achievement.description || 'No description'}</p>
                      <small>Value: {achievement.value || 'N/A'} | Category: {achievement.category || 'General'}</small>
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return 'Invalid achievements data';
            }
          }} 
        />
        
        <FunctionField 
          label="Certifications" 
          render={(record: any) => {
            if (!record.certifications) return 'No certifications defined';
            try {
              const certifications = JSON.parse(record.certifications);
              if (!Array.isArray(certifications)) return 'No certifications defined';
              return (
                <div>
                  {certifications.map((cert: any, index: number) => (
                    <div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <strong>{cert.name || 'Untitled'}</strong>
                      <p>Issuer: {cert.issuer || 'Unknown'}</p>
                      <p>{cert.description || 'No description'}</p>
                      <small>Issued: {cert.date_issued || 'N/A'} | Expires: {cert.expiry_date || 'N/A'}</small>
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return 'Invalid certifications data';
            }
          }} 
        />
      </Tab>

      {/* Leadership Tab */}
      <Tab label="Leadership">
        <RichTextField source="leadership_message" />
        <TextField source="leadership_name" />
        <TextField source="leadership_title" />
        <ImageField source="leadership_image_url" title="Leadership Image" />
      </Tab>

      {/* Call to Action Tab */}
      <Tab label="Call to Action">
        <TextField source="cta_title" />
        <RichTextField source="cta_description" />
        <TextField source="cta_primary_text" />
        <UrlField source="cta_primary_url" />
        <TextField source="cta_secondary_text" />
        <UrlField source="cta_secondary_url" />
        <ImageField source="cta_background_image_url" title="CTA Background" />
      </Tab>

      {/* SEO & Meta Tab */}
      <Tab label="SEO & Meta">
        <TextField source="meta_title" />
        <TextField source="meta_description" />
        <FunctionField 
          label="Meta Keywords" 
          render={(record: any) => {
            if (!record.meta_keywords) return 'None';
            try {
              if (Array.isArray(record.meta_keywords)) {
                return record.meta_keywords.join(', ');
              }
              return 'None';
            } catch (e) {
              return 'None';
            }
          }} 
        />
        <UrlField source="canonical_url" />
        <ImageField source="og_image_url" title="Open Graph Image" />
        <ImageField source="twitter_image_url" title="Twitter Image" />
      </Tab>

      {/* Legacy Tab */}
      <Tab label="Legacy">
        <ImageField source="image_url" title="Legacy Image" />
      </Tab>
    </TabbedShowLayout>
  </Show>
)