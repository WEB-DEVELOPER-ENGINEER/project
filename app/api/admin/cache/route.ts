import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/admin-api-utils';
import { cacheManager, CACHE_TAGS, invalidateCacheForResource } from '@/lib/cache-manager';

/**
 * Cache Management API
 * Provides endpoints for cache invalidation and statistics
 */

export async function POST(request: NextRequest) {
  const { authorized } = await checkAuth();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, target, resources } = body;

    switch (action) {
      case 'invalidate_all':
        cacheManager.clear();
        return NextResponse.json({ 
          success: true, 
          message: 'All cache cleared successfully' 
        });

      case 'invalidate_by_tag':
        if (!target) {
          return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
        }
        cacheManager.invalidateByTag(target);
        return NextResponse.json({ 
          success: true, 
          message: `Cache invalidated for tag: ${target}` 
        });

      case 'invalidate_by_tags':
        if (!Array.isArray(target)) {
          return NextResponse.json({ error: 'Tags array is required' }, { status: 400 });
        }
        cacheManager.invalidateByTags(target);
        return NextResponse.json({ 
          success: true, 
          message: `Cache invalidated for tags: ${target.join(', ')}` 
        });

      case 'invalidate_by_prefix':
        if (!target) {
          return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
        }
        cacheManager.invalidateByPrefix(target);
        return NextResponse.json({ 
          success: true, 
          message: `Cache invalidated for prefix: ${target}` 
        });

      case 'invalidate_resources':
        if (!Array.isArray(resources)) {
          return NextResponse.json({ error: 'Resources array is required' }, { status: 400 });
        }
        resources.forEach(resource => invalidateCacheForResource(resource));
        return NextResponse.json({ 
          success: true, 
          message: `Cache invalidated for resources: ${resources.join(', ')}` 
        });

      case 'invalidate_homepage':
        cacheManager.invalidateByTag(CACHE_TAGS.HOMEPAGE);
        return NextResponse.json({ 
          success: true, 
          message: 'Homepage cache invalidated' 
        });

      case 'invalidate_footer':
        cacheManager.invalidateByTag(CACHE_TAGS.FOOTER);
        return NextResponse.json({ 
          success: true, 
          message: 'Footer cache invalidated' 
        });

      case 'invalidate_navigation':
        cacheManager.invalidateByTag(CACHE_TAGS.NAVIGATION);
        return NextResponse.json({ 
          success: true, 
          message: 'Navigation cache invalidated' 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cache management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { authorized } = await checkAuth();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = cacheManager.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        cache_size: stats.size,
        tag_count: stats.tags,
        available_tags: Object.values(CACHE_TAGS),
        cache_actions: [
          'invalidate_all',
          'invalidate_by_tag',
          'invalidate_by_tags',
          'invalidate_by_prefix',
          'invalidate_resources',
          'invalidate_homepage',
          'invalidate_footer',
          'invalidate_navigation'
        ]
      }
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { authorized } = await checkAuth();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    cacheManager.clear();
    return NextResponse.json({ 
      success: true, 
      message: 'All cache cleared successfully' 
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}