export type AvatarSize = 'sm' | 'md' | 'lg';

export const AVATAR_BASE_CLASSES =
  'inline-grid shrink-0 place-items-center bg-linear-to-br from-accent-200 to-mint-300 font-extrabold text-neutral-900';

export const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-10 rounded-md text-xs',
  md: 'size-14 rounded-lg text-lg',
  lg: 'size-20 rounded-xl text-2xl',
};

export const MAX_INITIALS = 2;
