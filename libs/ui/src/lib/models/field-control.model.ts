/**
 * Shared look of every text-entry control (text field, textarea, select).
 * Sources: D1, D2, D5, D6, D8 (stage 2 differences, approved 2026-10-22); WCAG 1.4.11, 2.4.7.
 */
export const FIELD_CONTROL_CLASSES =
  'block w-full rounded-control border border-solid border-border-control bg-surface px-3 text-body text-ink placeholder:text-muted transition-colors duration-fast ease-standard hover:border-muted focus-visible:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50';

/** Invalid: danger border plus (in `ui-field`) the error text and icon. WCAG 1.4.1, 1.4.11. */
export const FIELD_CONTROL_INVALID_CLASSES =
  'border-danger hover:border-danger';

export const FIELD_CONTROL_SINGLE_LINE_CLASSES = 'h-control-md';
export const FIELD_CONTROL_MULTI_LINE_CLASSES =
  'min-h-control-md resize-y py-group';
