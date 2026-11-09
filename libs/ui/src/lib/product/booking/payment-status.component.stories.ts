import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PaymentStatusComponent } from './payment-status.component';

const meta: Meta<PaymentStatusComponent> = {
  decorators: [moduleMetadata({ imports: [PaymentStatusComponent] })],
  title: 'Product/E03 Booking and payment/Payment status',
  component: PaymentStatusComponent,
  render: (args) => ({
    props: { ...args, retried: 0 },
    template: `<div class="max-w-measure p-panel-roomy"><ui-payment-status [status]="status" (retry)="retried = retried + 1" /><p class="mt-groups text-body" role="log">Retried: {{ retried }}</p></div>`,
  }),
  args: { status: 'awaiting' },
  argTypes: {
    status: {
      control: 'select',
      options: ['awaiting', 'processing', 'paid', 'failed'],
    },
  },
};
export default meta;

type Story = StoryObj<PaymentStatusComponent>;

export const Playground: Story = {};
export const Processing: Story = { args: { status: 'processing' } };
export const Paid: Story = { args: { status: 'paid' } };
export const Failed: Story = { args: { status: 'failed' } };
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-payment-status status="awaiting" /><ui-payment-status status="processing" /><ui-payment-status status="paid" /><ui-payment-status status="failed" /></div>`,
  }),
};
export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><ui-payment-status status="failed" /></div>`,
  }),
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const RetriesWithAnotherCard: Story = {
  args: { status: 'failed' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Payment failed');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Try another card' }),
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('Retried: 1');
  },
};
