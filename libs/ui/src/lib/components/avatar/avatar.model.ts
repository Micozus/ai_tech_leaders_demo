export type AvatarSize = 'sm' | 'md' | 'lg';

/** P11 (referencje.md): flat fill, no gradient (A01). */
export const AVATAR_BASE_CLASSES =
  'inline-grid shrink-0 place-items-center rounded-control border border-solid border-line bg-surface-muted font-extrabold text-ink';

export const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-avatar-sm text-label',
  md: 'size-avatar-md text-section-title',
  lg: 'size-avatar-lg text-page-title',
};

export const MAX_INITIALS = 2;
