import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  InvitationBatchTableComponent,
  type InvitationRow,
} from './invitation-batch-table.component';

const ROWS: readonly InvitationRow[] = [
  { email: 'ada@example.com', status: 'published' },
  { email: 'grace@example.com', status: 'accepted' },
  { email: 'linus@example.com', status: 'invited' },
  { email: 'margaret@example.com', status: 'published' },
];
const BATCH_OF_TWENTY: readonly InvitationRow[] = Array.from(
  { length: 20 },
  (_, i) => ({
    email: `senior${i + 1}@example.com`,
    status:
      i < 6
        ? ('published' as const)
        : i < 12
          ? ('accepted' as const)
          : ('invited' as const),
  }),
);

const meta: Meta<InvitationBatchTableComponent> = {
  decorators: [moduleMetadata({ imports: [InvitationBatchTableComponent] })],
  title: 'Product/E05 Operator functions/Invitation batch table',
  component: InvitationBatchTableComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-invitation-batch-table [rows]="rows" [state]="state" /></div>`,
  }),
  args: { rows: ROWS, state: 'ready' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
    },
  },
};
export default meta;

type Story = StoryObj<InvitationBatchTableComponent>;

export const Playground: Story = {};
export const FullBatch: Story = { args: { rows: BATCH_OF_TWENTY } };
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { rows: [], state: 'empty' } };
export const ErrorState: Story = { args: { state: 'error' } };
export const StateMatrix: Story = {};
export const LongText: Story = {
  args: {
    rows: [
      {
        email:
          'maximilian.alexander.konstantinopoulos-wisniewski@a-very-long-company-domain-name.example.com',
        status: 'accepted',
      },
    ],
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
