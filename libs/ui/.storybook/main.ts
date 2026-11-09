import type { StorybookConfig } from '@storybook/angular';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';

// The prototype preview folder is git-ignored; only mount it when present.
const PUBLIC_DIR = fileURLToPath(new URL('./public', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  staticDirs: existsSync(PUBLIC_DIR) ? ['./public'] : [],
  addons: [
    {
      name: '@storybook/addon-docs',
      // Markdown tables render as tables, not as raw text with dashes.
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/angular',
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
    enableCrashReports: false,
  },
  features: { sidebarOnboardingChecklist: false },
};

export default config;
