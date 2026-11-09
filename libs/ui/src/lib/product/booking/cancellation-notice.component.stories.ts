import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NOW } from '../../../../.storybook/blocks/sample-data';
import { CancellationNoticeComponent } from './cancellation-notice.component';

const meta: Meta<CancellationNoticeComponent> = {
  decorators: [moduleMetadata({ imports: [CancellationNoticeComponent] })],
  title: 'Product/E03 Booking and payment/Cancellation notice',
  component: CancellationNoticeComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-cancellation-notice [startsAt]="startsAt" [now]="now" /></div>`,
  }),
  args: { startsAt: '2026-11-06T13:00:00Z', now: NOW },
};
export default meta;

type Story = StoryObj<CancellationNoticeComponent>;

export const Playground: Story = {};
export const FeeForfeited: Story = {
  args: { startsAt: '2026-11-05T09:00:00Z' },
};
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-cancellation-notice startsAt="2026-11-06T13:00:00Z" now="2026-11-04T10:00:00Z" /><ui-cancellation-notice startsAt="2026-11-05T09:00:00Z" now="2026-11-04T10:00:00Z" /></div>`,
  }),
};
export const LongText: Story = {
  args: { timeZone: 'America/Argentina/ComodRivadavia' },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const StatesTheRule: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Free cancellation'),
    ).toBeVisible();
  },
};
