import type { EventType } from './types';

export const EVENT_LABEL: Record<EventType, string> = {
  visit_completed: 'Visita completada',
  visit_detected: 'Visita detectada',
  no_visit_threshold_reached: 'Umbral sin visita alcanzado',
  low_occupancy_detected: 'Baja ocupación detectada',
  manual_enrollment: 'Enrollment manual',
};

/**
 * Given an event type, list the template keys whose trigger matches it.
 * Used by the event processor to enqueue workflow runs.
 */
export function templatesListeningFor(eventType: EventType): string[] {
  // Implemented thin — the real dispatcher during hackathon will walk the
  // TEMPLATES map. Keeping this helper as a stub with a clear signature.
  return [];
}
