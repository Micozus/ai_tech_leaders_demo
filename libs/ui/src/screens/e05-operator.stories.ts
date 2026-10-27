import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { DisputeRecordFormComponent } from '../lib/product/operator/dispute-record-form.component';
import {
  InvitationBatchTableComponent,
  type InvitationRow,
} from '../lib/product/operator/invitation-batch-table.component';
import { PriceBoundsFormComponent } from '../lib/product/operator/price-bounds-form.component';

const ROWS: readonly InvitationRow[] = Array.from({ length: 20 }, (_, i) => ({
  email: `senior${i + 1}@example.com`,
  status:
    i < 6
      ? ('published' as const)
      : i < 12
        ? ('accepted' as const)
        : ('invited' as const),
}));

const meta: Meta = {
  decorators: [
    moduleMetadata({
      imports: [
        AppHeaderComponent,
        DisputeRecordFormComponent,
        InvitationBatchTableComponent,
        PageHeaderComponent,
        PriceBoundsFormComponent,
      ],
    }),
  ],
  title: 'Product/E05 Operator functions/Screens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function batch(state: 'ready' | 'loading' | 'empty' | 'error'): Story {
  return {
    render: () => ({
      props: { state, rows: state === 'ready' ? ROWS : [] },
      template: `<ui-app-header userName="Oliwia" userRole="operator" /><main class="mx-auto max-w-page p-panel-roomy"><ui-page-header eyebrow="Operator" heading="Invitations" description="Batches of 20. Fewer than 5 mentors publishing a slot in two weeks stops further invitations." /><ui-invitation-batch-table [rows]="rows" [state]="state" /></main>`,
    }),
  };
}

/** The invitation batch of 20 and who published a slot (1.1). */
export const InvitationBatch: Story = batch('ready');
export const InvitationBatchLoading: Story = batch('loading');
export const InvitationBatchEmpty: Story = batch('empty');
export const InvitationBatchError: Story = batch('error');

/** Price bounds, the fee, and recording a dispute outcome (1.1). */
export const OperatorSettings: Story = {
  render: () => ({
    template: `<ui-app-header userName="Oliwia" userRole="operator" /><main class="mx-auto max-w-page p-panel-roomy"><ui-page-header eyebrow="Operator" heading="Settings and disputes" /><div class="grid gap-panel-roomy md:grid-cols-2"><ui-price-bounds-form /><ui-dispute-record-form /></div></main>`,
  }),
};
