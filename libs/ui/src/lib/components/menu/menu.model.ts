export interface MenuEntry {
  readonly label: string;
  /** A PrimeIcons class such as `pi-sign-out`; decorative. */
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly command?: () => void;
}
