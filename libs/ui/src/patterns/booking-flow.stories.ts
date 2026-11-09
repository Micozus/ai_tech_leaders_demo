import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../.storybook/blocks/api-mock';
import { NOW, SLOTS } from '../../.storybook/blocks/sample-data';
import { postJson } from '../lib/helpers/submit-outcome.helper';
import { BookingFlowComponent } from '../lib/product/booking/booking-flow.component';

const payer = () => postJson('/api/payments', { slotId: 'thu' });

function scenario(api: ApiScenario): StoryObj<BookingFlowComponent> {
  return {
    beforeEach: () => installApiMock(api),
    render: () => ({
      props: { payer, slots: SLOTS, now: NOW },
      template: `<div class="max-w-measure p-panel-roomy"><ui-booking-flow mentorName="Ada Lovelace" [slots]="slots" [now]="now" [price25]="25" [price50]="45" [payer]="payer" /></div>`,
    }),
  };
}

const meta: Meta<BookingFlowComponent> = {
  decorators: [moduleMetadata({ imports: [BookingFlowComponent] })],
  title: 'Patterns/Booking flow',
  component: BookingFlowComponent,
};
export default meta;

type Story = StoryObj<BookingFlowComponent>;

async function toPayment(canvas: ReturnType<typeof within>): Promise<void> {
  await userEvent.click(canvas.getByRole('radio', { name: /16:00/ }));
  await userEvent.click(
    canvas.getByRole('button', { name: 'Continue to payment' }),
  );
}

export const PickASlot: Story = scenario('success');
export const NarrowScreen: Story = {
  ...scenario('success'),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const ASlotUnderTwoHoursCannotBeChosen: Story = {
  ...scenario('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('radio', { name: /starts in less than 2 hours/ }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Continue to payment' }),
    ).toBeDisabled();
  },
};

export const ReviewAndPay: Story = {
  ...scenario('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await toPayment(canvas);
    await expect(canvas.getByText('Free cancellation')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Pay €45.00' }),
    ).toBeVisible();
  },
};

export const Paying: Story = {
  ...scenario('pending'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await toPayment(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pay €45.00' }));
    await waitFor(() =>
      expect(canvas.getByText('Waiting for your bank')).toBeVisible(),
    );
  },
};

export const PaymentFailedStaysOnPayment: Story = {
  ...scenario('server-error'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await toPayment(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pay €45.00' }));
    await waitFor(() =>
      expect(canvas.getByRole('alert')).toHaveTextContent('Payment failed'),
    );
    await expect(canvas.getByText(/Step 2 of 3/)).toBeVisible();
  },
};

export const ConfirmedOnlyAfterPayment: Story = {
  ...scenario('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await toPayment(canvas);
    await expect(canvas.queryByText('Booking confirmed')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Pay €45.00' }));
    await waitFor(() =>
      expect(canvas.getByText('Booking confirmed')).toBeVisible(),
    );
    await expect(canvas.getByText(/Step 3 of 3/)).toBeVisible();
  },
};
