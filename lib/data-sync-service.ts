/**
 * Data Synchronization Service
 * Ensures real-time data synchronization between admin and frontend
 */

import { cacheManager, invalidateCacheForResource, RESOURCE_CACHE_TAGS } from './cache-manager';

export interface DataSyncEvent {
  resource: string;
  action: 'create' | 'update' | 'delete' | 'bulk_delete';
  id?: string | number;
  ids?: (string | number)[];
  timestamp: number;
}

export class DataSyncService {
  private static instance: DataSyncService;
  private eventQueue: DataSyncEvent[] = [];
  private isProcessing = false;

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  /**
   * Record a data change event
   */
  recordEvent(event: Omit<DataSyncEvent, 'timestamp'>): void {
    const syncEvent: DataSyncEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.eventQueue.push(syncEvent);
    this.processQueue();
  }

  /**
   * Process the event queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()!;
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single sync event
   */
  private async processEvent(event: DataSyncEvent): Promise<void> {
    console.log(`Processing sync event: ${event.action} on ${event.resource}`);

    // Invalidate cache for the affected resource
    invalidateCacheForResource(event.resource);

    // Handle special cases for related resources
    await this.handleRelatedResourceInvalidation(event);

    // Log the event for debugging
    this.logEvent(event);
  }

  /**
   * Handle cache invalidation for related resources
   */
  private async handleRelatedResourceInvalidation(event: DataSyncEvent): Promise<void> {
    const { resource } = event;

    // Special handling for resources that affect multiple cache tags
    switch (resource) {
      case 'site_settings':
        // Site settings affect multiple pages
        cacheManager.invalidateByTags(['homepage', 'navigation', 'footer']);
        break;

      case 'icons':
        // Icons affect multiple resources that use them
        cacheManager.invalidateByTags(['services', 'footer_links', 'top_bar_items', 'team_social_links']);
        break;

      case 'footer_sections':
      case 'footer_links':
        // Footer changes affect all pages
        cacheManager.invalidateByTag('footer');
        break;

      case 'top_bar_items':
      case 'header_items':
        // Navigation changes affect all pages
        cacheManager.invalidateByTag('navigation');
        break;

      case 'client_images':
        // Client images affect client data and homepage
        cacheManager.invalidateByTags(['clients', 'homepage']);
        break;

      case 'project_images':
        // Project images affect project data and homepage
        cacheManager.invalidateByTags(['projects', 'homepage']);
        break;

      case 'team_member_social_links':
        // Team social links affect team members and homepage
        cacheManager.invalidateByTags(['team_members', 'homepage']);
        break;

      case 'cta_benefits':
        // CTA benefits affect CTA sections and homepage
        cacheManager.invalidateByTags(['cta_sections', 'homepage']);
        break;

      default:
        // For other resources, the basic invalidation is sufficient
        break;
    }
  }

  /**
   * Log sync events for debugging
   */
  private logEvent(event: DataSyncEvent): void {
    const logData = {
      timestamp: new Date(event.timestamp).toISOString(),
      resource: event.resource,
      action: event.action,
      id: event.id,
      ids: event.ids
    };

    console.log('Data sync event processed:', logData);

    // In production, you might want to send this to a logging service
    // or store it in a database for audit purposes
  }

  /**
   * Get sync statistics
   */
  getStats(): {
    queueLength: number;
    isProcessing: boolean;
    cacheStats: { size: number; tags: number };
  } {
    return {
      queueLength: this.eventQueue.length,
      isProcessing: this.isProcessing,
      cacheStats: cacheManager.getStats()
    };
  }

  /**
   * Force process all queued events
   */
  async forceSync(): Promise<void> {
    await this.processQueue();
  }

  /**
   * Clear the event queue
   */
  clearQueue(): void {
    this.eventQueue = [];
  }
}

// Export singleton instance
export const dataSyncService = DataSyncService.getInstance();

// Helper functions for common sync operations
export function syncResourceCreate(resource: string, id?: string | number): void {
  dataSyncService.recordEvent({
    resource,
    action: 'create',
    id
  });
}

export function syncResourceUpdate(resource: string, id: string | number): void {
  dataSyncService.recordEvent({
    resource,
    action: 'update',
    id
  });
}

export function syncResourceDelete(resource: string, id: string | number): void {
  dataSyncService.recordEvent({
    resource,
    action: 'delete',
    id
  });
}

export function syncResourceBulkDelete(resource: string, ids: (string | number)[]): void {
  dataSyncService.recordEvent({
    resource,
    action: 'bulk_delete',
    ids
  });
}