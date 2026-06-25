import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/seo/json-ld';
import { getProjectBySlug, getSEOMetadata, getFeaturedProjects } from '@/lib/data-access';
import { fetchProjectsPageData } from '@/lib/page-data-service';
import { ProjectDetailHero } from '@/components/sections/project-detail-hero';
import { ProjectDetailGallery } from '@/components/sections/project-detail-gallery';
import { ProjectDetailContent } from '@/components/sections/project-detail-content';
import { ProjectDetailSpecs } from '@/components/sections/project-detail-specs';
import { ProjectDetailResults } from '@/components/sections/project-detail-results';
import { ProjectDetailTimeline } from '@/components/sections/project-detail-timeline';
import { RelatedProjectsSection } from '@/components/sections/related-projects-section';
import { ProjectDetailCTA } from '@/components/sections/project-detail-cta';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const [project, seoData, { siteSettings }] = await Promise.all([
      getProjectBySlug(params.slug),
      getSEOMetadata('project', undefined).catch(() => null),
      fetchProjectsPageData()
    ]);

    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
      };
    }

    const title = seoData?.meta_title || `${project.title} | Project Portfolio`;
    const description = seoData?.meta_description || project.description.substring(0, 160);

    return {
      title,
      description,
      keywords: (seoData as any)?.meta_keywords || [
        'translation project',
        'interpretation project',
        project.title.toLowerCase(),
        'jusor translation',
        'professional translation',
        'language services',
        'project portfolio'
      ],
      openGraph: {
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${params.slug}`,
        type: 'article',
        locale: siteSettings.site_locale || 'en_US',
        siteName: siteSettings.company_name || 'Jusor Translation Services',
        images: project.images?.[0] ? [{
          url: project.images[0].image_url,
          width: 1200,
          height: 630,
          alt: project.images[0].alt_text || project.title,
        }] : [{
          url: seoData?.og_image || siteSettings.og_image || '/og-image-project.jpg',
          width: 1200,
          height: 630,
          alt: `${project.title} - Translation Project`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        images: project.images?.[0] ? [project.images[0].image_url] : [seoData?.twitter_image || '/twitter-image-project.jpg'],
        creator: '@jusortranslation',
        site: '@jusortranslation',
      },
      alternates: {
        canonical: seoData?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${params.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating project page metadata:', error);
    return {
      title: 'Project | Translation Portfolio',
      description: 'View our professional translation and interpretation project details.',
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const [project, { siteSettings, navigationData, footerData }, relatedProjects] = await Promise.all([
      getProjectBySlug(params.slug),
      fetchProjectsPageData(),
      getFeaturedProjects(6)
    ]);

    if (!project) {
      notFound();
    }

    // Filter out current project from related projects
    const filteredRelatedProjects = relatedProjects.filter(p => p.slug !== project.slug).slice(0, 3);

    // Generate structured data for the project
    const projectSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
      dateCreated: project.created_at,
      dateModified: project.updated_at,
      creator: {
        '@type': 'Organization',
        name: siteSettings.company_name || 'Jusor Translation Services',
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
      ...(project.images?.[0] && {
        image: {
          '@type': 'ImageObject',
          url: project.images[0].image_url,
          description: project.images[0].alt_text || project.title,
        }
      })
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
        },
      ],
    };

    return (
      <>
        <JsonLd data={projectSchema} />
        <JsonLd data={breadcrumbSchema} />
        
        <Navigation siteSettings={siteSettings} navigationData={navigationData} />
        
        <main id="main-content">
          {/* Hero Section */}
          <ProjectDetailHero 
            project={project}
            siteSettings={siteSettings}
          />

          {/* Project Gallery */}
          {project.images && project.images.length > 0 && (
            <ProjectDetailGallery 
              project={project}
              siteSettings={siteSettings}
            />
          )}

          {/* Project Content & Details */}
          <ProjectDetailContent 
            project={project}
            siteSettings={siteSettings}
          />

          {/* Project Specifications */}
          <ProjectDetailSpecs 
            project={project}
            siteSettings={siteSettings}
          />

          {/* Project Results & Impact */}
          <ProjectDetailResults 
            project={project}
            siteSettings={siteSettings}
          />

          {/* Project Timeline */}
          <ProjectDetailTimeline 
            project={project}
            siteSettings={siteSettings}
          />

          {/* Related Projects */}
          {filteredRelatedProjects.length > 0 && (
            <RelatedProjectsSection 
              relatedProjects={filteredRelatedProjects}
              currentProjectId={project.id}
              siteSettings={siteSettings}
            />
          )}

          {/* CTA Section */}
          <ProjectDetailCTA 
            project={project}
            siteSettings={siteSettings}
          />
        </main>
        
        <Footer footerData={footerData} siteSettings={siteSettings} />
      </>
    );
  } catch (error) {
    console.error('Error rendering project page:', error);
    notFound();
  }
}
