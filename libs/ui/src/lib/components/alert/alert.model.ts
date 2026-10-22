export type AlertTone = 'info' | 'success' | 'danger';

export const ALERT_BASE_CLASSES =
  'rounded-panel border border-solid px-groups py-3 text-body';

export const ALERT_TONE_CLASSES: Record<AlertTone, string> = {
  info: 'border-line bg-surface-muted text-ink',
  success: 'border-success bg-success-tint text-success',
  danger: 'border-danger-border bg-danger-tint text-danger',
};
