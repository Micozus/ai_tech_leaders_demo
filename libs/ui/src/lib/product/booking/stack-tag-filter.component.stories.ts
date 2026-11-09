import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { StackTagFilterComponent } from './stack-tag-filter.component';

const meta: Meta<StackTagFilterComponent> = {
  decorators: [moduleMetadata({ imports: [StackTagFilterComponent] })],
  title: 'Product/E03 Booking and payment/Stack tag filter',
  component: StackTagFilterComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-stack-tag-filter [resultCount]="resultCount" /></div>`,
  }),
  args: { resultCount: 12 },
};
export default meta;

type Story = StoryObj<StackTagFilterComponent>;

export const Playground: Story = {};
export const NoResults: Story = { args: { resultCount: 0 } };
export const OneResult: Story = { args: { resultCount: 1 } };
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-panel-roomy p-panel-roomy"><ui-stack-tag-filter [resultCount]="12" /><ui-stack-tag-filter [resultCount]="1" [selected]="['TypeScript', 'React']" /><ui-stack-tag-filter [resultCount]="0" [selected]="['Python']" /></div>`,
  }),
};
export const LongText: Story = { args: { resultCount: 1280 } };
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const FiltersAndClears: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'TypeScript' }));
    await expect(
      canvas.getByRole('button', { name: 'Remove TypeScript filter' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear filters' }),
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'TypeScript' }),
    ).not.toBeChecked();
  },
};
