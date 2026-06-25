export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Hero Section Skeleton */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            {/* Breadcrumb skeleton */}
            <div className="mb-6 flex justify-center">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Badge skeleton */}
            <div className="mb-6 flex justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Title skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse mx-8"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="mb-8 space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mx-16"></div>
            </div>
            
            {/* Highlights skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="section-padding bg-white">
        <div className="container">
          {/* Section header skeleton */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-6 mx-16"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mx-8"></div>
            </div>
          </div>

          {/* Projects grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image skeleton */}
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                
                {/* Content skeleton */}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-1"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-24 bg-gradient-to-br from-brand-blue to-brand-blue/90">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="h-10 bg-white/20 rounded animate-pulse mb-6 mx-16"></div>
            <div className="space-y-2 mb-12">
              <div className="h-6 bg-white/20 rounded animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded animate-pulse mx-8"></div>
            </div>
            
            {/* Benefits grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4 flex items-center">
                  <div className="h-5 w-5 bg-white/20 rounded animate-pulse mr-3"></div>
                  <div className="h-5 bg-white/20 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="h-12 w-40 bg-white/20 rounded animate-pulse"></div>
              <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
