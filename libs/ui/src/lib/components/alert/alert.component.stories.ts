import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'UI/Alert',
  component: AlertComponent,
  render: (args) => ({
    props: args,
    template: `<ui-alert [tone]="tone">Sessions are text-based, 25 or 50 minutes.</ui-alert>`,
  }),
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'danger'] },
  },
};
export default meta;

type Story = StoryObj<AlertComponent>;

export const Info: Story = { args: { tone: 'info' } };
export const Success: Story = { args: { tone: 'success' } };
export const Danger: Story = { args: { tone: 'danger' } };
