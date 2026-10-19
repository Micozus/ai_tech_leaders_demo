import { MAX_INITIALS } from './avatar.model';

/** Upper-cased first letters of the first words of a display name (`Ada Lovelace` → `AL`). */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
