import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'UI/Badge',
  component: BadgeComponent,
  render: (args) => ({
    props: args,
    template: `<ui-badge [tone]="tone">TypeScript</ui-badge>`,
  }),
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
};
export default meta;

type Story = StoryObj<BadgeComponent>;

export const Neutral: Story = { args: { tone: 'neutral' } };
export const Accent: Story = { args: { tone: 'accent' } };
export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Danger: Story = { args: { tone: 'danger' } };
