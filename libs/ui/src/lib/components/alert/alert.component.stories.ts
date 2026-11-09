import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  decorators: [moduleMetadata({ imports: [AlertComponent] })],
  title: 'Primitives/Alert',
  component: AlertComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-alert [tone]="tone" [heading]="heading">Sessions are text only, 25 or 50 minutes.</ui-alert></div>`,
  }),
  args: { tone: 'info', heading: '' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'danger'] },
  },
};
export default meta;

type Story = StoryObj<AlertComponent>;

export const Playground: Story = {};
export const Info: Story = { args: { tone: 'info' } };
export const Success: Story = {
  args: { tone: 'success', heading: 'Booking confirmed' },
};
export const Danger: Story = {
  args: { tone: 'danger', heading: 'Payment failed' },
};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-alert tone="info">Sessions are text only, 25 or 50 minutes.</ui-alert>
        <ui-alert tone="success" heading="Booking confirmed">Thursday 14:00. The mentor will write the answer after the session.</ui-alert>
        <ui-alert tone="danger" heading="Payment failed">Your bank declined the payment. Try another card; the slot is held for 10 minutes.</ui-alert>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><ui-alert tone="danger" heading="We could not confirm your payment with the payment provider">Your bank returned an error we do not recognise. Nothing was charged. Try again in a few minutes, or use another card. If it keeps failing, write to the operators and give them the time of your attempt.</ui-alert></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-alert tone="danger" heading="GitHub sign-in did not complete">Try again, or sign in with email.</ui-alert></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-alert tone="danger" heading="Payment failed">Try another card. The slot is held for 10 minutes.</ui-alert></div>
          <p class="text-body">Say what happened and what to do next.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-alert tone="danger">Error</ui-alert></div>
          <p class="text-body">"Error" tells the person nothing and offers no next step.</p>
        </section>
      </div>`,
  }),
};

export const AnnouncedByTone: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-group p-panel-roomy"><ui-alert tone="danger" heading="Payment failed">Try another card.</ui-alert><ui-alert tone="info">Sessions are text only.</ui-alert></div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Payment failed');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Sessions are text only.',
    );
  },
};
