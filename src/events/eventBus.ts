/**
 * Event Bus for Cross-Module Data Synchronization
 * Manages event-driven communication between modules
 */

import React from 'react';
import { UnifiedCustomer, UnifiedEmployee, UnifiedProject } from '../types/unified';

// Event type definitions
export type EventMap = {
  // Customer Events
  'customer:created': UnifiedCustomer;
  'customer:updated': { id: string; updates: Partial<UnifiedCustomer> };
  'customer:deleted': { id: string };
  'customer:status-changed': { id: string; status: UnifiedCustomer['status'] };

  // Employee Events
  'employee:hired': UnifiedEmployee;
  'employee:updated': { id: string; updates: Partial<UnifiedEmployee> };
  'employee:deleted': { id: string };
  'employee:assigned': { employeeId: string; projectId: string; role: string };
  'employee:unassigned': { employeeId: string; projectId: string };
  'employee:certification-updated': { employeeId: string; certification: any };

  // Project Events
  'project:created': UnifiedProject;
  'project:updated': { id: string; updates: Partial<UnifiedProject> };
  'project:deleted': { id: string };
  'project:status-changed': { id: string; status: UnifiedProject['status'] };
  'project:milestone-completed': { projectId: string; milestoneId: string };

  // CRM Events
  'lead:created': any;
  'lead:converted': { leadId: string; customerId: string };
  'opportunity:created': any;
  'opportunity:won': { opportunityId: string; projectId: string };
  'opportunity:lost': { opportunityId: string; reason: string };

  // HR Events
  'training:enrolled': { employeeId: string; courseId: string };
  'training:completed': { employeeId: string; courseId: string; score?: number };
  'certification:expired': { employeeId: string; certificationId: string };

  // Invoicing Events
  'invoice:created': { invoiceId: string; customerId: string; projectId?: string };
  'invoice:sent': { invoiceId: string };
  'invoice:paid': { invoiceId: string; amount: number };
  'invoice:overdue': { invoiceId: string };

  // Document Events
  'document:uploaded': { documentId: string; customerId?: string; projectId?: string };
  'document:shared': { documentId: string; sharedWith: string[] };
  'contract:signed': { contractId: string; projectId: string };

  // Inventory Events
  'material:allocated': { materialId: string; projectId: string; quantity: number };
  'material:delivered': { materialId: string; projectId: string; quantity: number };
  'material:low-stock': { materialId: string; currentStock: number; minimumStock: number };

  // Job Costing Events
  'job-cost:added': { projectId: string; costEntry: any };
  'job-cost:updated': { projectId: string; costEntryId: string; updates: any };

  // Permit Events
  'permit:applied': { projectId: string; permitId: string };
  'permit:approved': { projectId: string; permitId: string };
  'permit:expired': { projectId: string; permitId: string };

  // Inspection Events
  'inspection:scheduled': { projectId: string; inspectionId: string };
  'inspection:completed': { projectId: string; inspectionId: string; result: 'Passed' | 'Failed' };

  // Sync Events
  'sync:customer': { customerId: string };
  'sync:employee': { employeeId: string };
  'sync:project': { projectId: string };
  'sync:completed': { entity: string; entityId: string; success: boolean };

  // System Events
  'system:backup': { timestamp: string };
  'system:error': { error: string; context: any };
  'system:notification': { message: string; type: 'info' | 'warning' | 'error' | 'success' };
};

type EventListener<T = any> = (data: T) => void | Promise<void>;

class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private eventHistory: Array<{ event: string; data: any; timestamp: string }> = [];
  private maxHistorySize = 1000;

  /**
   * Subscribe to an event
   */
  on<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(listener);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Subscribe to an event only once
   */
  once<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      listener(data);
    });
  }

  /**
   * Emit an event
   */
  async emit<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void> {
    // Add to history
    this.eventHistory.push({
      event,
      data,
      timestamp: new Date().toISOString(),
    });

    // Trim history if it exceeds max size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }

    // Get listeners for this event
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      return;
    }

    // Execute all listeners
    const promises: Promise<void>[] = [];
    for (const listener of Array.from(eventListeners)) {
      try {
        const result = listener(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
        this.emit('system:error', {
          error: `Event listener error for ${event}`,
          context: { event, data, error },
        });
      }
    }

    // Wait for all async listeners to complete
    if (promises.length > 0) {
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error(`Error waiting for async listeners for ${event}:`, error);
      }
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<K extends keyof EventMap>(event: K): void {
    this.listeners.delete(event);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Get all events that match a pattern
   */
  getEvents(pattern?: string): Array<{ event: string; data: any; timestamp: string }> {
    if (!pattern) {
      return [...this.eventHistory];
    }

    const regex = new RegExp(pattern);
    return this.eventHistory.filter((entry) => regex.test(entry.event));
  }

  /**
   * Get listener count for an event
   */
  listenerCount<K extends keyof EventMap>(event: K): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }

  /**
   * Get all registered event names
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Set maximum history size
   */
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    if (this.eventHistory.length > size) {
      this.eventHistory = this.eventHistory.slice(-size);
    }
  }

  /**
   * Debug: Get current state
   */
  getDebugInfo() {
    return {
      activeListeners: Array.from(this.listeners.entries()).map(([event, listeners]) => ({
        event,
        listenerCount: listeners.size,
      })),
      historyCount: this.eventHistory.length,
      maxHistorySize: this.maxHistorySize,
      recentEvents: this.eventHistory.slice(-10),
    };
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Type-safe event emitter hook for React components
export const useEventEmitter = () => {
  return {
    emit: eventBus.emit.bind(eventBus),
    on: eventBus.on.bind(eventBus),
    once: eventBus.once.bind(eventBus),
    off: eventBus.off.bind(eventBus),
  };
};

// Event subscription hook for React components
export const useEventSubscription = <K extends keyof EventMap>(
  event: K,
  listener: EventListener<EventMap[K]>,
  deps: React.DependencyList = []
) => {
  React.useEffect(() => {
    const unsubscribe = eventBus.on(event, listener);
    return unsubscribe;
  }, deps);
};

// Multiple event subscription hook
export const useEventSubscriptions = (
  subscriptions: Array<{
    event: keyof EventMap;
    listener: EventListener;
  }>
) => {
  React.useEffect(() => {
    const unsubscribers = subscriptions.map(({ event, listener }) =>
      eventBus.on(event, listener)
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);
};

// Event history hook
export const useEventHistory = (pattern?: string) => {
  const [events, setEvents] = React.useState(() => eventBus.getEvents(pattern));

  React.useEffect(() => {
    const updateEvents = () => {
      setEvents(eventBus.getEvents(pattern));
    };

    // Listen to any event to update history
    const unsubscribers = [
      'customer:created',
      'customer:updated',
      'employee:hired',
      'project:created',
    ].map((event) => eventBus.on(event as keyof EventMap, updateEvents));

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [pattern]);

  return events;
};

export default eventBus;