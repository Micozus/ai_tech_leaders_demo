import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import type { Slot } from '../models/product.model';
import { SlotPublisherComponent } from './slot-publisher.component';

const SLOTS: readonly Slot[] = [
  { id: 'a', startsAt: '2026-11-05T13:00:00Z', state: 'free' },
  { id: 'b', startsAt: '2026-11-05T15:00:00Z', state: 'booked' },
  { id: 'c', startsAt: '2026-11-06T09:00:00Z', state: 'free' },
];
const MANY: readonly Slot[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i),
  startsAt: `2026-11-${String(5 + Math.floor(i / 4)).padStart(2, '0')}T${String(9 + (i % 4) * 2).padStart(2, '0')}:00:00Z`,
  state: i % 5 === 0 ? ('booked' as const) : ('free' as const),
}));

const meta: Meta<SlotPublisherComponent> = {
  decorators: [moduleMetadata({ imports: [SlotPublisherComponent] })],
  title: 'Product/E02 Mentors become bookable/Slot publisher',
  component: SlotPublisherComponent,
  render: (args) => ({
    props: { ...args, log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-slot-publisher [slots]="slots" [state]="state" (unpublish)="log = 'Unpublished ' + $event" /><p class="mt-groups text-body" role="status">{{ log }}</p></div>`,
  }),
  args: { slots: SLOTS, state: 'ready' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
    },
  },
};
export default meta;

type Story = StoryObj<SlotPublisherComponent>;

export const Playground: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { slots: [], state: 'empty' } };
export const ErrorState: Story = { args: { state: 'error' } };
export const ManySlots: Story = { args: { slots: MANY } };
export const PartialData: Story = { args: { slots: [SLOTS[1]] } };
export const StateMatrix: Story = {
  render: () => ({
    props: { slots: SLOTS },
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-slot-publisher [slots]="slots" /><ui-slot-publisher [slots]="[]" state="empty" /><ui-slot-publisher [slots]="[]" state="loading" /><ui-slot-publisher [slots]="[]" state="error" /></div>`,
  }),
};
export const LongText: Story = {
  args: { timeZone: 'America/Argentina/ComodRivadavia' },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const UnpublishesAFreeSlot: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getAllByRole('button', { name: /Unpublish/ })[0],
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Unpublished a');
  },
};
