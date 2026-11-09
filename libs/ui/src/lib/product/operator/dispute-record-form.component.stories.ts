import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DisputeRecordFormComponent } from './dispute-record-form.component';

const meta: Meta<DisputeRecordFormComponent> = {
  decorators: [moduleMetadata({ imports: [DisputeRecordFormComponent] })],
  title: 'Product/E05 Operator functions/Dispute record form',
  component: DisputeRecordFormComponent,
  render: () => ({
    props: { log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-dispute-record-form (recorded)="log = $event.outcome" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
};
export default meta;

type Story = StoryObj<DisputeRecordFormComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const LongText: Story = {};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const NeedsNotesThenRecords: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Record outcome' }),
    );
    await expect(
      canvas.getByText('Write what you decided and why.'),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('radio', { name: 'Refund paid by hand' }),
    );
    await userEvent.type(
      canvas.getByLabelText(/Notes for the shared operator note/),
      'Refunded 45 EUR by hand.',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Record outcome' }),
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('refund-by-hand');
  },
};
