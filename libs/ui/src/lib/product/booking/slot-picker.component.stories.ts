import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NOW, SLOTS } from '../../../../.storybook/blocks/sample-data';
import { SlotPickerComponent } from './slot-picker.component';

const meta: Meta<SlotPickerComponent> = {
  decorators: [moduleMetadata({ imports: [SlotPickerComponent] })],
  title: 'Product/E03 Booking and payment/Slot picker',
  component: SlotPickerComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-slot-picker [slots]="slots" [now]="now" [price25]="price25" [price50]="price50" /></div>`,
  }),
  args: { slots: SLOTS, now: NOW, price25: 25, price50: 45 },
};
export default meta;

type Story = StoryObj<SlotPickerComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const NoFreeSlots: Story = {
  args: { slots: SLOTS.filter((s) => s.state === 'booked') },
};
export const LongText: Story = {
  args: { timeZone: 'America/Argentina/ComodRivadavia' },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const ChoosesLengthAndSlot: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /25 minutes/ }));
    await expect(
      canvas.getByRole('radio', { name: /25 minutes/ }),
    ).toBeChecked();
    await expect(
      canvas.getAllByRole('radio', { name: /starts in less than 2 hours/ })[0],
    ).toBeDisabled();
    await userEvent.click(
      canvas
        .getAllByRole('radio')
        .filter((r) => !(r as HTMLInputElement).disabled)[2],
    );
    await expect(
      canvas
        .getAllByRole('radio')
        .filter((r) => (r as HTMLInputElement).checked),
    ).toHaveLength(2);
  },
};
