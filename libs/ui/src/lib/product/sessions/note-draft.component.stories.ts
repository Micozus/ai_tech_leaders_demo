import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NoteDraftComponent } from './note-draft.component';

const NOTE =
  'Constrain the type parameter first. Use a helper type to narrow instead of recursing on the whole object. Add the type test to CI.';

const meta: Meta<NoteDraftComponent> = {
  decorators: [moduleMetadata({ imports: [NoteDraftComponent] })],
  title: 'Product/E04 Session, written answer and note/Note draft',
  component: NoteDraftComponent,
  render: (args) => ({
    props: { ...args, log: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-note-draft [initial]="initial" [menteeComment]="menteeComment" (sent)="log = 'Sent: ' + $event.length" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
  args: { initial: '', menteeComment: '' },
};
export default meta;

type Story = StoryObj<NoteDraftComponent>;

export const Playground: Story = {};
export const Redraft: Story = {
  args: {
    initial: NOTE,
    menteeComment: 'Please add why the helper type is better than recursion.',
  },
};
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-note-draft /><ui-note-draft initial="Constrain the type parameter first. Use a helper type to narrow instead of recursing." menteeComment="Please add why." /></div>`,
  }),
};
export const LongText: Story = {
  args: {
    initial: NOTE.repeat(12),
    menteeComment:
      'Please add why the helper type is better than recursion, and show the failing case from my repository so I can use this note later without opening the session again.',
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const RejectsAShortNoteAndSendsALongOne: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Note'), 'Too short');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Send for approval' }),
    );
    await expect(
      canvas.getByText(/Write at least 40 characters/),
    ).toBeVisible();
    await userEvent.clear(canvas.getByLabelText('Note'));
    await userEvent.type(canvas.getByLabelText('Note'), NOTE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Send for approval' }),
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('Sent:');
  },
};
