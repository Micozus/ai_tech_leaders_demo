import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NoteApprovalComponent } from '../lib/product/sessions/note-approval.component';
import { NoteDraftComponent } from '../lib/product/sessions/note-draft.component';

const NOTE =
  'Constrain the type parameter first. Use a helper type to narrow instead of recursing on the whole object. Add the type test to CI.';

const meta: Meta = {
  decorators: [
    moduleMetadata({ imports: [NoteDraftComponent, NoteApprovalComponent] }),
  ],
  title: 'Patterns/Note approval',
  render: () => ({
    props: {
      step: 'drafting',
      note: '',
      comment: '',
      drafted(text: string): void {
        this['note'] = text;
        this['step'] = 'waiting';
      },
      approved(): void {
        this['step'] = 'approved';
      },
      declined(text: string): void {
        this['comment'] = text;
        this['step'] = 'drafting';
      },
    },
    template: `
      <div class="max-w-measure p-panel-roomy">
        <p class="mb-groups text-meta text-muted" role="status">{{ step === 'drafting' ? 'Mentor: draft the note' : step === 'waiting' ? 'Mentee: approve or decline' : 'Approved: kept privately by both' }}</p>
        @if (step === 'drafting') { <ui-note-draft [menteeComment]="comment" (sent)="drafted($event)" /> }
        @if (step === 'waiting') { <ui-note-approval [note]="note" (approved)="approved()" (declined)="declined($event)" /> }
      </div>`,
  }),
};
export default meta;

type Story = StoryObj;

export const MentorDrafts: Story = {};

export const MenteeDecidesInFull: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Note'), NOTE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Send for approval' }),
    );
    await expect(
      await canvas.findByRole('button', { name: 'Approve note' }),
    ).toBeVisible();
    await expect(canvas.getByText(/nothing is published/)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Approve note' }));
    await waitFor(() =>
      expect(canvas.getByRole('status')).toHaveTextContent(
        'kept privately by both',
      ),
    );
  },
};

export const DeclinedReturnsToTheMentorWithTheComment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Note'), NOTE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Send for approval' }),
    );
    await userEvent.click(
      await canvas.findByRole('radio', { name: /Decline it/ }),
    );
    await userEvent.type(
      canvas.getByLabelText('Comment for the mentor'),
      'Please add why.',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Send comment' }));
    await expect(
      await canvas.findByText('The mentee asked for changes'),
    ).toBeVisible();
    await expect(canvas.getByText('Please add why.')).toBeVisible();
  },
};
