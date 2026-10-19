export type AlertTone = 'info' | 'success' | 'danger';

export const ALERT_BASE_CLASSES =
  'rounded-md border border-solid px-4 py-3 text-xs leading-relaxed';

export const ALERT_TONE_CLASSES: Record<AlertTone, string> = {
  info: 'border-accent-200 bg-accent-50 text-accent-800',
  success: 'border-green-200 bg-success-tint text-green-800',
  danger: 'border-red-200 bg-danger-tint text-danger',
};
