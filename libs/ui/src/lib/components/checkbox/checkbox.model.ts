/**
 * One row for a checkbox or a radio: the whole row is the click target (WCAG 2.5.8),
 * the native input keeps its semantics and takes the accent colour. D21, D6.
 */
export const CHOICE_ROW_CLASSES =
  'flex min-h-control-sm w-fit cursor-pointer items-center gap-group rounded-control px-group text-body text-ink transition-colors duration-fast ease-standard hover:bg-surface-muted has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus [&>input]:size-5 [&>input]:shrink-0 [&>input]:cursor-pointer [&>input]:accent-accent [&>input:disabled]:cursor-not-allowed';
