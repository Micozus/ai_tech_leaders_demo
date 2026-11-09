import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PriceFormComponent } from './price-form.component';

const meta: Meta<PriceFormComponent> = {
  decorators: [moduleMetadata({ imports: [PriceFormComponent] })],
  title: 'Product/E02 Mentors become bookable/Price form',
  component: PriceFormComponent,
  render: (args) => ({
    props: { ...args, saved: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-price-form [bounds]="bounds" (saved)="saved = $event.price25 + ' / ' + $event.price50" /><p class="mt-groups text-body" role="status">{{ saved }}</p></div>`,
  }),
  args: { bounds: { min25: 15, max25: 150, min50: 25, max50: 300 } },
};
export default meta;

type Story = StoryObj<PriceFormComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const LongText: Story = {
  args: { bounds: { min25: 1500, max25: 150000, min50: 2500, max50: 300000 } },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const RejectsOutOfBoundsAndSavesValid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('25 minutes (EUR)'), '200');
    await userEvent.type(canvas.getByLabelText('50 minutes (EUR)'), '45');
    await userEvent.click(canvas.getByRole('button', { name: 'Save prices' }));
    await expect(
      canvas.getByText(/must be between €15.00 and €150.00/),
    ).toBeVisible();
    await userEvent.clear(canvas.getByLabelText('25 minutes (EUR)'));
    await userEvent.type(canvas.getByLabelText('25 minutes (EUR)'), '25');
    await userEvent.click(canvas.getByRole('button', { name: 'Save prices' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('25 / 45');
  },
};
