'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon_name: string;
  service_count?: number;
}

interface ServiceFilterProps {
  categories: ServiceCategory[];
  activeCategory: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
  servicesCount: number;
  services?: any[]; // Add services prop to calculate counts
}

export function ServiceFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  servicesCount,
  services = []
}: ServiceFilterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate service count for each category
  const getServiceCountForCategory = (categorySlug: string) => {
    if (!services || services.length === 0) return 0;
    
    return services.filter(service => {
      // Check both possible category structures
      return service.category?.slug === categorySlug ||
             service.service_category?.toLowerCase().replace(/\s+/g, '-') === categorySlug;
    }).length;
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div 
      className={`mb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="container">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
              <Filter className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Services
              </h3>
              <p className="text-sm text-gray-600">
                {servicesCount} service{servicesCount !== 1 ? 's' : ''} 
                {activeCategory && ` in ${categories.find(c => c.slug === activeCategory)?.name}`}
              </p>
            </div>
          </div>

          {/* Clear Filter */}
          {activeCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="text-gray-600 hover:text-gray-900 border-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filter
            </Button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* All Services Button */}
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={`transition-all duration-300 ${
              activeCategory === null
                ? 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            All Services
          </Button>

          {/* Category Buttons */}
          {categories.map((category, index) => {
            const isActive = activeCategory === category.slug;
            const serviceCount = getServiceCountForCategory(category.slug);
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.slug)}
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: isActive ? category.color : undefined,
                  borderColor: isActive ? category.color : undefined,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <Badge 
                  variant="secondary" 
                  className={`mr-2 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {serviceCount}
                </Badge>
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Active Filter Display */}
        {activeCategory && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">
                  Active Filter:
                </span>
                <Badge 
                  className="text-white"
                  style={{ 
                    backgroundColor: categories.find(c => c.slug === activeCategory)?.color || '#3B82F6' 
                  }}
                >
                  {categories.find(c => c.slug === activeCategory)?.name}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
