import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PayoutStatusComponent } from './payout-status.component';

const meta: Meta<PayoutStatusComponent> = {
  decorators: [moduleMetadata({ imports: [PayoutStatusComponent] })],
  title: 'Product/E02 Mentors become bookable/Payout status',
  component: PayoutStatusComponent,
  render: (args) => ({
    props: { ...args, acted: 0 },
    template: `<div class="max-w-measure p-panel-roomy"><ui-payout-status [status]="status" (act)="acted = acted + 1" /><p class="mt-groups text-body" role="status">Acted: {{ acted }}</p></div>`,
  }),
  args: { status: 'not-started' },
  argTypes: {
    status: {
      control: 'select',
      options: ['not-started', 'pending', 'enabled', 'restricted'],
    },
  },
};
export default meta;

type Story = StoryObj<PayoutStatusComponent>;

export const Playground: Story = {};
export const Pending: Story = { args: { status: 'pending' } };
export const Enabled: Story = { args: { status: 'enabled' } };
export const Restricted: Story = { args: { status: 'restricted' } };
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-payout-status status="not-started" /><ui-payout-status status="pending" /><ui-payout-status status="enabled" /><ui-payout-status status="restricted" /></div>`,
  }),
};
export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><ui-payout-status status="restricted" /></div>`,
  }),
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const ContinuesSetup: Story = {
  args: { status: 'pending' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continue setup' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Acted: 1');
  },
};
