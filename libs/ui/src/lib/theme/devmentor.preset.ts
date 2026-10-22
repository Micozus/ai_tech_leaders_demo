import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * PrimeNG preset that points the Aura theme at the DevMentor tokens. Every value is a
 * `var(--…)` reference to `styles/tokens.css`, so retuning a token retunes PrimeNG too.
 * Decisions: D1–D24 (stage 2, approved 2026-10-22), `lekcja-06/tokeny.md`.
 */
const NEUTRAL = {
  0: 'var(--color-neutral-0)',
  50: 'var(--color-neutral-50)',
  100: 'var(--color-neutral-100)',
  200: 'var(--color-neutral-200)',
  300: 'var(--color-neutral-300)',
  400: 'var(--color-neutral-400)',
  500: 'var(--color-neutral-500)',
  600: 'var(--color-neutral-600)',
  700: 'var(--color-neutral-700)',
  800: 'var(--color-neutral-800)',
  900: 'var(--color-neutral-900)',
  950: 'var(--color-neutral-900)',
};

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
    // D24: warm neutrals instead of Aura's cold slate.
    surface: NEUTRAL,
    // D8: fast feedback. D9: disabled at 50%.
    transitionDuration: 'var(--duration-fast)',
    disabledOpacity: '0.5',
    // D6: a 3px ring with a 2px offset on every focusable part.
    focusRing: {
      width: '3px',
      style: 'solid',
      color: 'var(--color-focus)',
      offset: '2px',
      shadow: 'none',
    },
    colorScheme: {
      light: {
        mask: {
          background: 'var(--color-scrim)',
          color: 'var(--color-on-inverse)',
        },
        text: {
          color: 'var(--color-ink)',
          hoverColor: 'var(--color-ink)',
          mutedColor: 'var(--color-muted)',
          hoverMutedColor: 'var(--color-ink)',
        },
        content: {
          background: 'var(--color-surface)',
          hoverBackground: 'var(--color-surface-muted)',
          borderColor: 'var(--color-line)',
          color: 'var(--color-ink)',
          hoverColor: 'var(--color-ink)',
        },
        highlight: {
          background: 'var(--color-accent-tint)',
          focusBackground: 'var(--color-accent-tint)',
          color: 'var(--color-accent-strong)',
          focusColor: 'var(--color-accent-strong)',
        },
        overlay: {
          // D12, D3: panel radius for dialogs, overlay radius for menus and popovers; one shadow, always with a line.
          modal: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-line)',
            color: 'var(--color-ink)',
            borderRadius: 'var(--radius-panel)',
            padding: 'var(--spacing-panel-roomy)',
            shadow: 'var(--shadow-overlay)',
          },
          popover: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-line)',
            color: 'var(--color-ink)',
            borderRadius: 'var(--radius-overlay)',
            padding: 'var(--spacing-panel)',
            shadow: 'var(--shadow-overlay)',
          },
          select: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-line)',
            color: 'var(--color-ink)',
            borderRadius: 'var(--radius-overlay)',
            shadow: 'var(--shadow-overlay)',
          },
          navigation: { shadow: 'var(--shadow-overlay)' },
        },
        // D11: menu rows are 32px; hover is the muted surface, selected the accent tint.
        navigation: {
          item: {
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-control)',
            focusBackground: 'var(--color-surface-muted)',
            activeBackground: 'var(--color-accent-tint)',
            color: 'var(--color-ink)',
            focusColor: 'var(--color-ink)',
            activeColor: 'var(--color-accent-strong)',
            icon: {
              color: 'var(--color-muted)',
              focusColor: 'var(--color-ink)',
              activeColor: 'var(--color-accent-strong)',
            },
          },
        },
        formField: {
          borderColor: 'var(--color-border-control)',
          hoverBorderColor: 'var(--color-muted)',
          focusBorderColor: 'var(--color-accent)',
          invalidBorderColor: 'var(--color-danger)',
          color: 'var(--color-ink)',
          placeholderColor: 'var(--color-muted)',
          background: 'var(--color-surface)',
          shadow: 'none',
        },
      },
    },
  },
  primitive: {
    borderRadius: {
      none: '0',
      xs: 'var(--radius-control)',
      sm: 'var(--radius-control)',
      md: 'var(--radius-control)',
      lg: 'var(--radius-panel)',
      xl: 'var(--radius-overlay)',
    },
  },
  components: {
    dialog: {
      title: { fontSize: 'var(--text-lg)', fontWeight: '700' },
      header: { gap: 'var(--spacing-group)' },
      footer: { gap: 'var(--spacing-group)' },
    },
    tooltip: {
      root: {
        background: 'var(--color-inverse)',
        color: 'var(--color-on-inverse)',
        borderRadius: 'var(--radius-control)',
        maxWidth: '20rem',
        fontSize: 'var(--text-xs)',
        shadow: 'none',
      },
    },
    tabs: {
      tab: {
        padding: '0.75rem 1rem',
        fontWeight: '700',
        color: 'var(--color-muted)',
        hoverColor: 'var(--color-ink)',
        activeColor: 'var(--color-accent)',
      },
      tablist: { borderColor: 'var(--color-line)' },
      activeBar: { height: '2px', background: 'var(--color-accent)' },
    },
    toast: {
      // A01: no glass. D13: statuses from our roles; nothing blurred.
      root: {
        blur: '0',
        transitionDuration: 'var(--duration-base)',
        borderRadius: 'var(--radius-panel)',
      },
      success: {
        background: 'var(--color-success-tint)',
        borderColor: 'var(--color-success)',
        color: 'var(--color-success)',
        detailColor: 'var(--color-ink)',
        shadow: 'var(--shadow-overlay)',
      },
      info: {
        background: 'var(--color-surface)',
        borderColor: 'var(--color-line)',
        color: 'var(--color-ink)',
        detailColor: 'var(--color-muted)',
        shadow: 'var(--shadow-overlay)',
      },
      warn: {
        background: 'var(--color-warning-tint)',
        borderColor: 'var(--color-warning)',
        color: 'var(--color-warning)',
        detailColor: 'var(--color-ink)',
        shadow: 'var(--shadow-overlay)',
      },
      error: {
        background: 'var(--color-danger-tint)',
        borderColor: 'var(--color-danger)',
        color: 'var(--color-danger)',
        detailColor: 'var(--color-ink)',
        shadow: 'var(--shadow-overlay)',
      },
    },
  },
});
