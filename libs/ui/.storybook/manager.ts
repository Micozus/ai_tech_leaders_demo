import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// The Storybook interface shows only the product name. No colours here: see tokens.css.
addons.setConfig({
  theme: create({ base: 'light', brandTitle: 'DevMentor' }),
});
