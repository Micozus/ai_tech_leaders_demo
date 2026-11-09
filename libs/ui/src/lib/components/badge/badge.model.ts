export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

/** A1 (referencje.md): no pills; the badge uses radius-control. */
export const BADGE_BASE_CLASSES =
  'inline-flex items-center gap-1 rounded-control border border-solid px-2 py-1 text-label whitespace-nowrap';

export const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'border-line bg-surface-muted text-muted',
  accent: 'border-transparent bg-accent-tint text-accent-strong',
  success: 'border-transparent bg-success-tint text-success',
  warning: 'border-transparent bg-warning-tint text-warning',
  danger: 'border-transparent bg-danger-tint text-danger',
};
