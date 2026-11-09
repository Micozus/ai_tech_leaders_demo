import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SESSIONS } from '../../.storybook/blocks/sample-data';
import { ConfirmDialogComponent } from '../lib/components/confirm-dialog/confirm-dialog.component';
import { SessionRowComponent } from '../lib/product/booking/session-row.component';

const meta: Meta = {
  decorators: [
    moduleMetadata({ imports: [SessionRowComponent, ConfirmDialogComponent] }),
  ],
  title: 'Patterns/Destructive confirmation',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      session: SESSIONS[0],
      open: false,
      message: '',
      ask(): void {
        this['open'] = true;
      },
      cancelBooking(): void {
        this['session'] = { ...SESSIONS[0], status: 'cancelled' };
        this['message'] = 'Booking cancelled.';
      },
      keep(): void {
        this['message'] = 'Booking kept.';
      },
    },
    template: `
      <div class="max-w-measure p-panel-roomy">
        <ui-session-row [session]="session" (cancelBooking)="ask()" />
        <p class="mt-groups text-body" role="status">{{ message }}</p>
        <ui-confirm-dialog heading="Cancel this booking?" [objectName]="session.title + ' with ' + session.withName + ', ' + session.startsAt"
          description="You are inside the 24 hours before the session, so the fee is not refunded." confirmLabel="Cancel booking" cancelLabel="Keep booking"
          [(open)]="open" (confirmed)="cancelBooking()" (cancelled)="keep()" />
      </div>`,
  }),
};
export default meta;

type Story = StoryObj;

export const Closed: Story = {};

export const AsksNamingTheObject: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Cancel booking' }),
    );
    const dialog = await page.findByRole('dialog');
    await expect(dialog).toHaveTextContent(
      'Architecture review of the billing service with Ada Lovelace',
    );
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: 'Keep booking' }),
      ).toHaveFocus(),
    );
  },
};

export const KeepingTheBookingChangesNothing: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Cancel booking' }),
    );
    await userEvent.click(
      await within(await page.findByRole('dialog')).findByRole('button', {
        name: 'Keep booking',
      }),
    );
    await waitFor(() =>
      expect(within(canvasElement).getByRole('status')).toHaveTextContent(
        'Booking kept.',
      ),
    );
    await expect(within(canvasElement).getByText('Booked')).toBeVisible();
  },
};

export const ConfirmingNamesTheAction: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Cancel booking' }),
    );
    await userEvent.click(
      await within(await page.findByRole('dialog')).findByRole('button', {
        name: 'Cancel booking',
      }),
    );
    await waitFor(() =>
      expect(within(canvasElement).getByRole('status')).toHaveTextContent(
        'Booking cancelled.',
      ),
    );
    await expect(within(canvasElement).getByText('Cancelled')).toBeVisible();
  },
};
