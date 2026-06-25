'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailGalleryProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailGallery({ project, siteSettings = {} }: ProjectDetailGalleryProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!project.images || project.images.length === 0) {
    return null;
  }

  const images = project.images;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-white"
      aria-labelledby="project-gallery-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 
            id="project-gallery-heading"
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Project Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the visual documentation of this translation project, showcasing our professional 
            approach and attention to detail.
          </p>
        </div>

        {images.length === 1 ? (
          // Single image - featured layout
          <div 
            className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={images[0].image_url}
                  alt={images[0].alt_text || project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Zoom indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
              </div>
              
              {images[0].description && (
                <p className="text-center text-gray-600 mt-6 text-lg">
                  {images[0].description}
                </p>
              )}
            </div>
          </div>
        ) : (
          // Multiple images - grid with featured image
          <div className="max-w-6xl mx-auto">
            {/* Featured Image */}
            <div 
              className={`mb-8 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={images[0].image_url}
                    alt={images[0].alt_text || `${project.title} - Featured Image`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="h-6 w-6 text-gray-900" />
                    </div>
                  </div>
                </div>
                
                {images[0].description && (
                  <p className="text-center text-gray-600 mt-4">
                    {images[0].description}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.slice(1).map((image, index) => (
                  <div 
                    key={image.id}
                    className={`group cursor-pointer transition-all duration-700 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${300 + index * 100}ms`
                    }}
                    onClick={() => openLightbox(index + 1)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || `${project.title} - Image ${index + 2}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <ZoomIn className="h-4 w-4 text-gray-900" />
                        </div>
                      </div>
                    </div>
                    
                    {image.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lightbox Modal */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95 border-0">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Download button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 z-10 text-white hover:bg-white/20"
                onClick={() => handleDownload(
                  images[selectedImageIndex].image_url,
                  `${project.title}-${selectedImageIndex + 1}`
                )}
              >
                <Download className="h-5 w-5" />
              </Button>

              {/* Main image */}
              <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
                <Image
                  src={images[selectedImageIndex].image_url}
                  alt={images[selectedImageIndex].alt_text || `${project.title} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                  {images[selectedImageIndex].description && (
                    <p className="text-sm mb-2">{images[selectedImageIndex].description}</p>
                  )}
                  <p className="text-xs text-gray-300">
                    Image {selectedImageIndex + 1} of {images.length}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
