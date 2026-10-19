export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export const BADGE_BASE_CLASSES =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs whitespace-nowrap';

export const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  accent: 'bg-accent-100 text-accent-800',
  success: 'bg-success-tint text-green-800',
  warning: 'bg-warning-tint text-amber-800',
  danger: 'bg-red-100 text-red-800',
};
