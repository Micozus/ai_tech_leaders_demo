import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * PrimeNG preset that points the Aura theme at the DevMentor tokens. Every value is a
 * `var(--…)` reference to `styles/tokens.css`, so retuning a token retunes PrimeNG too.
 */
export const DEVMENTOR_PRESET = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--color-accent-50)',
      100: 'var(--color-accent-100)',
      200: 'var(--color-accent-200)',
      300: 'var(--color-accent-300)',
      400: 'var(--color-accent-400)',
      500: 'var(--color-accent-500)',
      600: 'var(--color-accent-600)',
      700: 'var(--color-accent-700)',
      800: 'var(--color-accent-800)',
      900: 'var(--color-accent-900)',
      950: 'var(--color-accent-900)',
    },
  },
  primitive: {
    borderRadius: {
      none: '0',
      xs: 'var(--radius-sm)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
  },
});
