import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  decorators: [moduleMetadata({ imports: [BadgeComponent] })],
  title: 'Primitives/Badge',
  component: BadgeComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel"><ui-badge [tone]="tone">Booked</ui-badge></div>`,
  }),
  args: { tone: 'success' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
};
export default meta;

type Story = StoryObj<BadgeComponent>;

export const Playground: Story = {};
export const Neutral: Story = { args: { tone: 'neutral' } };
export const Accent: Story = { args: { tone: 'accent' } };
export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Danger: Story = { args: { tone: 'danger' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-group p-panel">
        <ui-badge tone="accent">Invited</ui-badge>
        <ui-badge tone="warning">Awaiting payment</ui-badge>
        <ui-badge tone="success">Booked</ui-badge>
        <ui-badge tone="neutral">Cancelled</ui-badge>
        <ui-badge tone="danger">Payment failed</ui-badge>
        <ui-badge tone="success">Payouts enabled</ui-badge>
        <ui-badge tone="warning">Payouts pending</ui-badge>
        <ui-badge tone="neutral">TypeScript</ui-badge>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel" style="width: 14rem"><ui-badge tone="warning">Awaiting confirmation from the payment provider</ui-badge></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="flex flex-wrap gap-group p-panel" style="width: 20rem"><ui-badge tone="neutral">TypeScript</ui-badge><ui-badge tone="neutral">React</ui-badge><ui-badge tone="neutral">Python</ui-badge><ui-badge tone="neutral">AI agents</ui-badge></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-badge tone="success">Booked</ui-badge></div>
          <p class="text-body">The word carries the status; colour only supports it.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><span class="inline-block size-3 rounded-control bg-success"></span></div>
          <p class="text-body">A coloured dot with no word: colour is the only signal.</p>
        </section>
      </div>`,
  }),
};

export const ReadsAsText: Story = {
  render: () => ({
    template: `<div class="p-panel"><ui-badge tone="warning">Awaiting payment</ui-badge></div>`,
  }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Awaiting payment'),
    ).toBeVisible();
  },
};
