export type ButtonVariant = 'primary' | 'soft' | 'quiet' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-md border border-solid font-bold leading-snug whitespace-nowrap no-underline cursor-pointer transition duration-fast ease-standard hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-on-accent hover:border-accent-strong hover:bg-accent-strong',
  soft: 'border-transparent bg-accent-tint text-accent-800 hover:border-accent-300',
  quiet: 'border-line bg-canvas text-ink hover:border-accent-300',
  danger: 'border-red-200 bg-danger-tint text-danger hover:border-danger',
  ghost: 'border-transparent bg-transparent text-accent hover:bg-accent-tint',
};

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-4 py-3 text-sm',
  sm: 'px-3 py-2 text-xs',
};

export const BUTTON_BLOCK_CLASSES = 'w-full';
export const BUTTON_BUSY_CLASSES = 'pointer-events-none opacity-70';
