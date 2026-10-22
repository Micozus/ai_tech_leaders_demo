import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    // Accessibility violations fail the story (run by `npm run test-storybook`).
    a11y: { test: 'error' },
    controls: { expanded: true },
    docs: { toc: true },
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
