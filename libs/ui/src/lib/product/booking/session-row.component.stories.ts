import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SESSIONS } from '../../../../.storybook/blocks/sample-data';
import { SessionRowComponent } from './session-row.component';

const meta: Meta<SessionRowComponent> = {
  decorators: [moduleMetadata({ imports: [SessionRowComponent] })],
  title: 'Product/E03 Booking and payment/Session row',
  component: SessionRowComponent,
  render: (args) => ({
    props: { ...args, log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-session-row [session]="session" (openSession)="log = 'open ' + $event" (cancelBooking)="log = 'cancel ' + $event" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
  args: { session: SESSIONS[0] },
};
export default meta;

type Story = StoryObj<SessionRowComponent>;

export const Playground: Story = {};
export const AwaitingPayment: Story = { args: { session: SESSIONS[1] } };
export const Completed: Story = { args: { session: SESSIONS[2] } };
export const StateMatrix: Story = {
  render: () => ({
    props: {
      sessions: SESSIONS,
      cancelled: { ...SESSIONS[0], id: 's4', status: 'cancelled' as const },
    },
    template: `<div class="max-w-measure p-panel-roomy">@for (s of sessions; track s.id) {<ui-session-row [session]="s" />}<ui-session-row [session]="cancelled" /></div>`,
  }),
};
export const LongText: Story = {
  args: {
    session: {
      ...SESSIONS[0],
      title:
        'Architecture review of the billing service, the invoice export and the retry logic of the payment webhook',
      withName: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
    },
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const OpensAndCancels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open session' }));
    await expect(canvas.getByRole('log')).toHaveTextContent('open s1');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Cancel booking' }),
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('cancel s1');
  },
};
