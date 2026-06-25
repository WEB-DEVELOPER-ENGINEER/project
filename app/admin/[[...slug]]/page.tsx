'use client'

import { Admin, Resource } from 'react-admin'
import { uploadDataProvider } from '@/lib/uploadDataProvider'
import { authProvider } from '@/lib/authProvider'

// Avoid build-time prerendering for Admin; render dynamically at request time
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Blog Posts
import { PostList } from '@/components/admin/posts/PostList'
import { PostEdit } from '@/components/admin/posts/PostEdit'
import { PostCreate } from '@/components/admin/posts/PostCreate'
import { PostShow } from '@/components/admin/posts/PostShow'

// Top Bar Items
import { TopBarItemsList } from '@/components/admin/top-bar-items/TopBarItemsList'
import { TopBarItemsCreate } from '@/components/admin/top-bar-items/TopBarItemsCreate'
import { TopBarItemsEdit } from '@/components/admin/top-bar-items/TopBarItemsEdit'
import { TopBarItemsShow } from '@/components/admin/top-bar-items/TopBarItemsShow'

// Header Items
import { HeaderItemsList } from '@/components/admin/header-items/HeaderItemsList'
import { HeaderItemsCreate } from '@/components/admin/header-items/HeaderItemsCreate'
import { HeaderItemsEdit } from '@/components/admin/header-items/HeaderItemsEdit'
import { HeaderItemsShow } from '@/components/admin/header-items/HeaderItemsShow'

// Services
import { ServicesList } from '@/components/admin/services/ServicesList'
import { ServicesCreate } from '@/components/admin/services/ServicesCreate'
import { ServicesEdit } from '@/components/admin/services/ServicesEdit'
import { ServicesShow } from '@/components/admin/services/ServicesShow'

// Service Categories
import { ServiceCategoriesList } from '@/components/admin/service-categories/ServiceCategoriesList'
import { ServiceCategoriesCreate } from '@/components/admin/service-categories/ServiceCategoriesCreate'
import { ServiceCategoriesEdit } from '@/components/admin/service-categories/ServiceCategoriesEdit'
import { ServiceCategoriesShow } from '@/components/admin/service-categories/ServiceCategoriesShow'

// Projects
import { ProjectsList } from '@/components/admin/projects/ProjectsList'
import { ProjectsCreate } from '@/components/admin/projects/ProjectsCreate'
import { ProjectsEdit } from '@/components/admin/projects/ProjectsEdit'
import { ProjectsShow } from '@/components/admin/projects/ProjectsShow'

// Testimonials
import { TestimonialsList } from '@/components/admin/testimonials/TestimonialsList'
import { TestimonialsCreate } from '@/components/admin/testimonials/TestimonialsCreate'
import { TestimonialsEdit } from '@/components/admin/testimonials/TestimonialsEdit'
import { TestimonialsShow } from '@/components/admin/testimonials/TestimonialsShow'

// Team Members
import { TeamMembersList } from '@/components/admin/team-members/TeamMembersList'
import { TeamMembersCreate } from '@/components/admin/team-members/TeamMembersCreate'
import { TeamMembersEdit } from '@/components/admin/team-members/TeamMembersEdit'
import { TeamMembersShow } from '@/components/admin/team-members/TeamMembersShow'


// Contact Submissions
import { ContactSubmissionsList } from '@/components/admin/contact-submissions/ContactSubmissionsList'
import { ContactSubmissionsShow } from '@/components/admin/contact-submissions/ContactSubmissionsShow'


// About Us
import { AboutUsList } from '@/components/admin/about-us/AboutUsList'
import { AboutUsCreate } from '@/components/admin/about-us/AboutUsCreate'
import { AboutUsEdit } from '@/components/admin/about-us/AboutUsEdit'
import { AboutUsShow } from '@/components/admin/about-us/AboutUsShow'

// SEO Metadata
import { SeoMetadataList } from '@/components/admin/seo-metadata/SeoMetadataList'
import { SeoMetadataCreate } from '@/components/admin/seo-metadata/SeoMetadataCreate'
import { SeoMetadataEdit } from '@/components/admin/seo-metadata/SeoMetadataEdit'
import { SeoMetadataShow } from '@/components/admin/seo-metadata/SeoMetadataShow'

// Features
import { FeaturesList } from '@/components/admin/features/FeaturesList'
import { FeaturesCreate } from '@/components/admin/features/FeaturesCreate'
import { FeaturesEdit } from '@/components/admin/features/FeaturesEdit'
import { FeaturesShow } from '@/components/admin/features/FeaturesShow'

// Footer Sections
import { FooterSectionsList } from '@/components/admin/footer-sections/FooterSectionsList'
import { FooterSectionsCreate } from '@/components/admin/footer-sections/FooterSectionsCreate'
import { FooterSectionsEdit } from '@/components/admin/footer-sections/FooterSectionsEdit'
import { FooterSectionsShow } from '@/components/admin/footer-sections/FooterSectionsShow'

// Footer Links
import { FooterLinksList } from '@/components/admin/footer-links/FooterLinksList'
import { FooterLinksCreate } from '@/components/admin/footer-links/FooterLinksCreate'
import { FooterLinksEdit } from '@/components/admin/footer-links/FooterLinksEdit'
import { FooterLinksShow } from '@/components/admin/footer-links/FooterLinksShow'

// CTA Sections
import { CtaSectionsList } from '@/components/admin/cta-sections/CtaSectionsList'
import { CtaSectionsCreate } from '@/components/admin/cta-sections/CtaSectionsCreate'
import { CtaSectionsEdit } from '@/components/admin/cta-sections/CtaSectionsEdit'
import { CtaSectionsShow } from '@/components/admin/cta-sections/CtaSectionsShow'

// Sliders
import { SlidersList } from '@/components/admin/sliders/SlidersList'
import { SlidersCreate } from '@/components/admin/sliders/SlidersCreate'
import { SlidersEdit } from '@/components/admin/sliders/SlidersEdit'
import { SlidersShow } from '@/components/admin/sliders/SlidersShow'

// Clients
import { ClientsList } from '@/components/admin/clients/ClientsList'
import { ClientsCreate } from '@/components/admin/clients/ClientsCreate'
import { ClientsEdit } from '@/components/admin/clients/ClientsEdit'
import { ClientsShow } from '@/components/admin/clients/ClientsShow'

// Icons
import { IconsList } from '@/components/admin/icons/IconsList'
import { IconsCreate } from '@/components/admin/icons/IconsCreate'
import { IconsEdit } from '@/components/admin/icons/IconsEdit'
import { IconsShow } from '@/components/admin/icons/IconsShow'

// Site Settings
import { SiteSettingsList } from '@/components/admin/site-settings/SiteSettingsList'
import { SiteSettingsCreate } from '@/components/admin/site-settings/SiteSettingsCreate'
import { SiteSettingsEdit } from '@/components/admin/site-settings/SiteSettingsEdit'
import { SiteSettingsShow } from '@/components/admin/site-settings/SiteSettingsShow'

// Users
import { UsersList } from '@/components/admin/users/UsersList'
import { UsersCreate } from '@/components/admin/users/UsersCreate'
import { UsersEdit } from '@/components/admin/users/UsersEdit'
import { UsersShow } from '@/components/admin/users/UsersShow'

// Dashboard
import { Dashboard } from '@/components/admin/Dashboard'

// New admin interfaces
import { ClientImagesList } from '@/components/admin/client-images/ClientImagesList'
import { ClientImagesCreate } from '@/components/admin/client-images/ClientImagesCreate'
import { ClientImagesEdit } from '@/components/admin/client-images/ClientImagesEdit'
import { ClientImagesShow } from '@/components/admin/client-images/ClientImagesShow'

import { ProjectImagesList } from '@/components/admin/project-images/ProjectImagesList'
import { ProjectImagesCreate } from '@/components/admin/project-images/ProjectImagesCreate'
import { ProjectImagesEdit } from '@/components/admin/project-images/ProjectImagesEdit'
import { ProjectImagesShow } from '@/components/admin/project-images/ProjectImagesShow'

import { TeamMemberSocialLinksList } from '@/components/admin/team-member-social-links/TeamMemberSocialLinksList'
import { TeamMemberSocialLinksCreate } from '@/components/admin/team-member-social-links/TeamMemberSocialLinksCreate'
import { TeamMemberSocialLinksEdit } from '@/components/admin/team-member-social-links/TeamMemberSocialLinksEdit'
import { TeamMemberSocialLinksShow } from '@/components/admin/team-member-social-links/TeamMemberSocialLinksShow'

import { CtaBenefitsList } from '@/components/admin/cta-benefits/CtaBenefitsList'
import { CtaBenefitsCreate } from '@/components/admin/cta-benefits/CtaBenefitsCreate'
import { CtaBenefitsEdit } from '@/components/admin/cta-benefits/CtaBenefitsEdit'
import { CtaBenefitsShow } from '@/components/admin/cta-benefits/CtaBenefitsShow'

// Blog Management
import { BlogAuthorsList } from '@/components/admin/blog-authors/BlogAuthorsList'
import { BlogAuthorsCreate } from '@/components/admin/blog-authors/BlogAuthorsCreate'
import { BlogAuthorsEdit } from '@/components/admin/blog-authors/BlogAuthorsEdit'
import { BlogAuthorsShow } from '@/components/admin/blog-authors/BlogAuthorsShow'

import { BlogCategoriesList } from '@/components/admin/blog-categories/BlogCategoriesList'
import { BlogCategoriesCreate } from '@/components/admin/blog-categories/BlogCategoriesCreate'
import { BlogCategoriesEdit } from '@/components/admin/blog-categories/BlogCategoriesEdit'
import { BlogCategoriesShow } from '@/components/admin/blog-categories/BlogCategoriesShow'

import { CompanyMetricsList } from '@/components/admin/company-metrics/CompanyMetricsList'
import { CompanyMetricsCreate } from '@/components/admin/company-metrics/CompanyMetricsCreate'
import { CompanyMetricsEdit } from '@/components/admin/company-metrics/CompanyMetricsEdit'
import { CompanyMetricsShow } from '@/components/admin/company-metrics/CompanyMetricsShow'

// Icons for resources
import {
  FileText,
  Settings,
  FolderOpen,
  MessageSquare,
  Users,
  Briefcase,
  Mail,
  Image,
  Star,
  Palette,
  Cog,
  UserCheck,
  Navigation,
  Menu,
  Info,
  Search,
  Layers,
  Link,
  Megaphone,
  MousePointer,
  ImageIcon,
  Share2,
  Award,
  Tags,
  User,
  BarChart3,
  BookOpen
} from 'lucide-react'

// Auth provider is imported from lib/authProvider.ts

export default function AdminPage() {
  return (
    <Admin
      dataProvider={uploadDataProvider}
      authProvider={authProvider}
      title="Admin Panel"
      dashboard={Dashboard}
    >
      {/* Navigation & Layout */}
      <Resource
        name="top-bar-items"
        list={TopBarItemsList}
        edit={TopBarItemsEdit}
        create={TopBarItemsCreate}
        show={TopBarItemsShow}
        options={{ label: 'Top Bar Items' }}
        icon={Navigation}
      />
      <Resource
        name="header-items"
        list={HeaderItemsList}
        edit={HeaderItemsEdit}
        create={HeaderItemsCreate}
        show={HeaderItemsShow}
        options={{ label: 'Header Items' }}
        icon={Menu}
      />
      
      {/* Content Management */}
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
        show={PostShow}
        options={{ label: 'Blog Posts' }}
        icon={FileText}
      />
      <Resource
        name="blog-authors"
        list={BlogAuthorsList}
        edit={BlogAuthorsEdit}
        create={BlogAuthorsCreate}
        show={BlogAuthorsShow}
        options={{ label: 'Blog Authors' }}
        icon={User}
      />
      <Resource
        name="blog-categories"
        list={BlogCategoriesList}
        edit={BlogCategoriesEdit}
        create={BlogCategoriesCreate}
        show={BlogCategoriesShow}
        options={{ label: 'Blog Categories' }}
        icon={BookOpen}
      />
      <Resource
        name="company-metrics"
        list={CompanyMetricsList}
        edit={CompanyMetricsEdit}
        create={CompanyMetricsCreate}
        show={CompanyMetricsShow}
        options={{ label: 'Company Metrics' }}
        icon={BarChart3}
      />
      <Resource
        name="about-us"
        list={AboutUsList}
        edit={AboutUsEdit}
        create={AboutUsCreate}
        show={AboutUsShow}
        options={{ label: 'About Us' }}
        icon={Info}
      />
      <Resource
        name="services"
        list={ServicesList}
        edit={ServicesEdit}
        create={ServicesCreate}
        show={ServicesShow}
        options={{ label: 'Services' }}
        icon={Settings}
      />
      <Resource
        name="service-categories"
        list={ServiceCategoriesList}
        edit={ServiceCategoriesEdit}
        create={ServiceCategoriesCreate}
        show={ServiceCategoriesShow}
        options={{ label: 'Service Categories' }}
        icon={Tags}
      />
      <Resource
        name="projects"
        list={ProjectsList}
        edit={ProjectsEdit}
        create={ProjectsCreate}
        show={ProjectsShow}
        options={{ label: 'Projects' }}
        icon={FolderOpen}
      />
      <Resource
        name="sliders"
        list={SlidersList}
        edit={SlidersEdit}
        create={SlidersCreate}
        show={SlidersShow}
        options={{ label: 'Hero Sliders' }}
        icon={Image}
      />

      {/* People & Reviews */}
      <Resource
        name="team-members"
        list={TeamMembersList}
        edit={TeamMembersEdit}
        create={TeamMembersCreate}
        show={TeamMembersShow}
        options={{ label: 'Team Members' }}
        icon={Users}
      />
      <Resource
        name="testimonials"
        list={TestimonialsList}
        edit={TestimonialsEdit}
        create={TestimonialsCreate}
        show={TestimonialsShow}
        options={{ label: 'Testimonials' }}
        icon={Star}
      />
      <Resource
        name="clients"
        list={ClientsList}
        edit={ClientsEdit}
        create={ClientsCreate}
        show={ClientsShow}
        options={{ label: 'Clients' }}
        icon={Briefcase}
      />

      {/* HR & Communications */}
      <Resource
        name="contact-submissions"
        list={ContactSubmissionsList}
        show={ContactSubmissionsShow}
        options={{ label: 'Contact Submissions' }}
        icon={Mail}
      />

      {/* Features & Marketing */}
      <Resource
        name="features"
        list={FeaturesList}
        edit={FeaturesEdit}
        create={FeaturesCreate}
        show={FeaturesShow}
        options={{ label: 'Features' }}
        icon={Layers}
      />
      <Resource
        name="cta-sections"
        list={CtaSectionsList}
        edit={CtaSectionsEdit}
        create={CtaSectionsCreate}
        show={CtaSectionsShow}
        options={{ label: 'CTA Sections' }}
        icon={Megaphone}
      />

      {/* Footer Management */}
      <Resource
        name="footer-sections"
        list={FooterSectionsList}
        edit={FooterSectionsEdit}
        create={FooterSectionsCreate}
        show={FooterSectionsShow}
        options={{ label: 'Footer Sections' }}
        icon={Layers}
      />
      <Resource
        name="footer-links"
        list={FooterLinksList}
        edit={FooterLinksEdit}
        create={FooterLinksCreate}
        show={FooterLinksShow}
        options={{ label: 'Footer Links' }}
        icon={Link}
      />

      {/* SEO & Configuration */}
      <Resource
        name="seo-metadata"
        list={SeoMetadataList}
        edit={SeoMetadataEdit}
        create={SeoMetadataCreate}
        show={SeoMetadataShow}
        options={{ label: 'SEO Metadata' }}
        icon={Search}
      />

      {/* System & Configuration */}
      <Resource
        name="icons"
        list={IconsList}
        edit={IconsEdit}
        create={IconsCreate}
        show={IconsShow}
        options={{ label: 'Icons' }}
        icon={Palette}
      />
      <Resource
        name="site-settings"
        list={SiteSettingsList}
        edit={SiteSettingsEdit}
        create={SiteSettingsCreate}
        show={SiteSettingsShow}
        options={{ label: 'Site Settings' }}
        icon={Cog}
      />
      <Resource
        name="users"
        list={UsersList}
        edit={UsersEdit}
        create={UsersCreate}
        show={UsersShow}
        options={{ label: 'Admin Users' }}
        icon={UserCheck}
      />

      {/* Media & Assets */}
      <Resource
        name="client-images"
        list={ClientImagesList}
        edit={ClientImagesEdit}
        create={ClientImagesCreate}
        show={ClientImagesShow}
        options={{ label: 'Client Images' }}
        icon={ImageIcon}
      />
      <Resource
        name="project-images"
        list={ProjectImagesList}
        edit={ProjectImagesEdit}
        create={ProjectImagesCreate}
        show={ProjectImagesShow}
        options={{ label: 'Project Images' }}
        icon={ImageIcon}
      />
      <Resource
        name="team-member-social-links"
        list={TeamMemberSocialLinksList}
        edit={TeamMemberSocialLinksEdit}
        create={TeamMemberSocialLinksCreate}
        show={TeamMemberSocialLinksShow}
        options={{ label: 'Team Social Links' }}
        icon={Share2}
      />
      <Resource
        name="cta-benefits"
        list={CtaBenefitsList}
        edit={CtaBenefitsEdit}
        create={CtaBenefitsCreate}
        show={CtaBenefitsShow}
        options={{ label: 'CTA Benefits' }}
        icon={Award}
      />

    </Admin>
  )
}