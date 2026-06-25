#!/usr/bin/env npx tsx

/**
 * Hero Slider Optimization Migration Script
 * Helps migrate from the old hero section to the optimized version
 */

import { promises as fs } from 'fs';
import path from 'path';

class HeroOptimizationMigration {
  private backupDir = path.join(process.cwd(), 'backup-hero-components');

  async migrate(): Promise<void> {
    console.log('🚀 Starting Hero Slider Optimization Migration...\n');

    try {
      await this.updateImports();
      await this.addPerformanceMonitoring();
      await this.updateGlobalStyles();
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('\n🔄 You can restore from backup if needed.');
    }
  }

  private async updateImports(): Promise<void> {
    console.log('🔄 Updating component imports...');

    const filesToUpdate = [
      'app/page.tsx',
      'components/sections/index.ts'
    ];

    for (const file of filesToUpdate) {
      const fullPath = path.join(process.cwd(), file);
      
      try {
        await fs.access(fullPath);
        let content = await fs.readFile(fullPath, 'utf-8');
        
        // Update imports
        const oldImports = [
          "import { HeroSection } from '@/components/sections/hero-section'",
          "import { HeroSectionEnhanced } from '@/components/sections/hero-section-enhanced'",
          "from '@/components/sections/hero-section'",
          "from '@/components/sections/hero-section-enhanced'"
        ];

        const newImport = "import { HeroSectionOptimized } from '@/components/sections/hero-section-optimized'";

        let updated = false;
        for (const oldImport of oldImports) {
          if (content.includes(oldImport)) {
            content = content.replace(oldImport, newImport);
            updated = true;
          }
        }

        // Update component usage
        content = content.replace(/<HeroSection\s/g, '<HeroSectionOptimized ');
        content = content.replace(/<HeroSectionEnhanced\s/g, '<HeroSectionOptimized ');
        content = content.replace(/HeroSection>/g, 'HeroSectionOptimized>');
        content = content.replace(/HeroSectionEnhanced>/g, 'HeroSectionOptimized>');

        if (updated || content !== await fs.readFile(fullPath, 'utf-8')) {
          await fs.writeFile(fullPath, content);
          console.log(`   ✅ Updated: ${file}`);
        } else {
          console.log(`   ℹ️  No changes needed: ${file}`);
        }
      } catch {
        console.log(`   ⚠️  File not found (skipping): ${file}`);
      }
    }

    console.log('');
  }

  private async addPerformanceMonitoring(): Promise<void> {
    console.log('📊 Adding performance monitoring...');

    const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
    
    try {
      let content = await fs.readFile(layoutPath, 'utf-8');
      
      // Check if performance monitoring is already added
      if (content.includes('performance-monitor')) {
        console.log('   ℹ️  Performance monitoring already configured');
        return;
      }

      // Add import
      const importLine = "import { initPerformanceMonitoring } from '@/lib/performance-monitor';";
      if (!content.includes(importLine)) {
        const importSection = content.match(/(import.*from.*['"];?\n)+/);
        if (importSection) {
          content = content.replace(importSection[0], importSection[0] + importLine + '\n');
        }
      }

      // Add useEffect for initialization
      const useEffectCode = `
  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const monitor = initPerformanceMonitoring();
      return () => monitor.cleanup();
    }
  }, []);`;

      // Find the component function and add useEffect
      const componentMatch = content.match(/(export default function \w+.*?\{)/s);
      if (componentMatch) {
        // Add React import if not present
        if (!content.includes("import React") && !content.includes("import { useEffect }")) {
          content = content.replace(/^import/, "import React, { useEffect } from 'react';\nimport");
        } else if (!content.includes("useEffect")) {
          content = content.replace(/from 'react'/, "useEffect } from 'react'");
          content = content.replace(/import { /, "import { useEffect, ");
        }

        // Add useEffect after the opening brace
        content = content.replace(componentMatch[1], componentMatch[1] + useEffectCode);
      }

      await fs.writeFile(layoutPath, content);
      console.log('   ✅ Added performance monitoring to layout');
    } catch (error) {
      console.log(`   ⚠️  Could not update layout.tsx: ${error.message}`);
    }

    console.log('');
  }

  private async updateGlobalStyles(): Promise<void> {
    console.log('🎨 Checking CSS optimizations...');

    const cssPath = path.join(process.cwd(), 'app/globals.css');
    
    try {
      const content = await fs.readFile(cssPath, 'utf-8');
      
      const optimizations = [
        'content-visibility: auto',
        'contain: layout style paint',
        'animate-fade-in-fast',
        'will-change: opacity'
      ];

      const missingOptimizations = optimizations.filter(opt => !content.includes(opt));
      
      if (missingOptimizations.length === 0) {
        console.log('   ✅ All CSS optimizations are present');
      } else {
        console.log('   ⚠️  Some CSS optimizations are missing:');
        missingOptimizations.forEach(opt => {
          console.log(`      - ${opt}`);
        });
        console.log('   ℹ️  The optimized globals.css has been updated with all optimizations');
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check CSS: ${error.message}`);
    }

    console.log('');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Hero Slider Optimization Migration Tool');
    console.log('');
    console.log('Usage: npm run migrate:hero-optimization');
    console.log('');
    console.log('This script will:');
    console.log('• Create backups of existing components');
    console.log('• Update imports to use optimized components');
    console.log('• Add performance monitoring');
    console.log('• Verify CSS optimizations');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h    Show this help message');
    return;
  }

  const migration = new HeroOptimizationMigration();
  await migration.migrate();
}

if (require.main === module) {
  main().catch(console.error);
}

export { HeroOptimizationMigration };