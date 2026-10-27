import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PriceBoundsFormComponent } from './price-bounds-form.component';

const meta: Meta<PriceBoundsFormComponent> = {
  decorators: [moduleMetadata({ imports: [PriceBoundsFormComponent] })],
  title: 'Product/E05 Operator functions/Price bounds form',
  component: PriceBoundsFormComponent,
  render: () => ({
    props: { log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-price-bounds-form (saved)="log = 'saved ' + $event.feePercent" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
};
export default meta;

type Story = StoryObj<PriceBoundsFormComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const LongText: Story = {};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const ValidatesThenSaves: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save bounds and fee' }),
    );
    await expect(canvas.getAllByRole('alert')).toHaveLength(5);
    for (const [label, value] of [
      ['Lowest price, 25 minutes (EUR)', '15'],
      ['Highest price, 25 minutes (EUR)', '150'],
      ['Lowest price, 50 minutes (EUR)', '25'],
      ['Highest price, 50 minutes (EUR)', '300'],
      ['Platform fee (percent)', '20'],
    ] as const) {
      await userEvent.type(canvas.getByLabelText(label), value);
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save bounds and fee' }),
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('saved 20');
  },
};
