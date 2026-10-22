import type { Preview } from '@storybook/angular';
import { create } from 'storybook/theming';

// Docs pages use the product fonts (no colours here: see tokens.css).
const DOCS_THEME = create({
  base: 'light',
  fontBase: "'Inter Variable', Inter, ui-sans-serif, system-ui, sans-serif",
  fontCode:
    "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
});

const preview: Preview = {
  parameters: {
    // Accessibility violations fail the story (run by `npm run test-storybook`).
    a11y: { test: 'error' },
    controls: { expanded: true },
    docs: { toc: true, theme: DOCS_THEME },
    options: {
      storySort: {
        order: [
          'Design system',
          [
            'Start here',
            'Components',
            'How to choose',
            'Usage and accessibility',
            'Content',
            'What to avoid',
            'What is missing',
            'Contributing',
            '*',
          ],
          'Foundations',
          [
            'Color',
            'Typography',
            'Spacing and layout',
            'Shape and depth',
            'Motion',
            'Icons',
            'Themes',
          ],
          'Primitives',
          'Product',
          'Patterns',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
