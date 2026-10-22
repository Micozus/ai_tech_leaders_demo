export type ButtonVariant = 'primary' | 'soft' | 'quiet' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'sm';

/** Shape, density and state of every button. Sources: tokeny.md (radius-control, control-height, duration-fast). */
export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center gap-group rounded-control border border-solid font-bold leading-snug whitespace-nowrap no-underline cursor-pointer transition-colors duration-fast ease-standard disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-on-accent hover:border-accent-strong hover:bg-accent-strong active:border-accent-pressed active:bg-accent-pressed',
  soft: 'border-transparent bg-accent-tint text-accent-strong hover:border-accent active:border-accent-strong',
  quiet:
    'border-border-control bg-surface text-ink hover:bg-surface-muted active:bg-line',
  danger:
    'border-danger-border bg-danger-tint text-danger hover:border-danger active:border-danger',
  ghost:
    'border-transparent bg-transparent text-accent hover:bg-accent-tint hover:text-accent-strong active:text-accent-strong',
};

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-control-md px-groups text-body',
  sm: 'h-control-sm px-3 text-label',
};

export const BUTTON_BLOCK_CLASSES = 'w-full';
/** Busy text stays fully legible (WCAG 1.4.3): no opacity, only no pointer events. */
export const BUTTON_BUSY_CLASSES = 'pointer-events-none';
