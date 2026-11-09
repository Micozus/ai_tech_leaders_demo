import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NoteApprovalComponent } from './note-approval.component';

const NOTE =
  'Constrain the type parameter first.\nUse a helper type to narrow instead of recursing on the whole object.\nAdd the type test to CI.';

const meta: Meta<NoteApprovalComponent> = {
  decorators: [moduleMetadata({ imports: [NoteApprovalComponent] })],
  title: 'Product/E04 Session, written answer and note/Note approval',
  component: NoteApprovalComponent,
  render: (args) => ({
    props: { ...args, log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-note-approval [author]="author" [note]="note" (approved)="log = 'approved'" (declined)="log = 'declined: ' + $event" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
  args: { author: 'Ada Lovelace', note: NOTE },
};
export default meta;

type Story = StoryObj<NoteApprovalComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const LongText: Story = { args: { note: NOTE.repeat(10) } };
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const DeclineNeedsACommentApproveKeepsItPrivate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /Decline it/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send comment' }));
    await expect(canvas.getByText(/Say what to change/)).toBeVisible();
    await userEvent.type(
      canvas.getByLabelText('Comment for the mentor'),
      'Add why',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Send comment' }));
    await expect(canvas.getByRole('log')).toHaveTextContent(
      'declined: Add why',
    );
  },
};
