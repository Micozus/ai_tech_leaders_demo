import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

const meta: Meta<ConfirmDialogComponent> = {
  decorators: [
    moduleMetadata({ imports: [ConfirmDialogComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Confirm dialog',
  component: ConfirmDialogComponent,
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    props: { ...args, open: true },
    template: `<ui-confirm-dialog [heading]="heading" [objectName]="objectName" [description]="description" [confirmLabel]="confirmLabel" [cancelLabel]="cancelLabel" [(open)]="open" />`,
  }),
  args: {
    heading: 'Cancel this booking?',
    objectName: 'Architecture review with Ada Lovelace, Thursday 14:00',
    description:
      'You are inside the 24 hours before the session, so the fee is not refunded.',
    confirmLabel: 'Cancel booking',
    cancelLabel: 'Keep booking',
  },
};
export default meta;

type Story = StoryObj<ConfirmDialogComponent>;

export const Playground: Story = {};

/** The open state. The closed state is the page itself. */
export const StateMatrix: Story = {};

export const LongText: Story = {
  args: {
    heading:
      'Cancel this booking and forfeit the fee for a session that starts in less than twenty-four hours?',
    objectName:
      'Architecture review of the billing service pull request with Ada Lovelace, Thursday 14:00 to 14:50',
    description:
      'The mentor keeps the fee. If a mentor cancels, you are refunded in full. The slot becomes bookable again for other mentees as soon as you confirm.',
  },
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><div class="rounded-overlay border border-solid border-line bg-surface p-panel-roomy shadow-overlay"><p class="mb-group text-section-title">Cancel this booking?</p><p class="mb-groups text-body"><strong>Architecture review with Ada, Thursday 14:00</strong></p><div class="flex justify-end gap-group"><button ui-button variant="quiet">Keep booking</button><button ui-button variant="danger">Cancel booking</button></div></div></div>
          <p class="text-body">The question names the object; the way out comes first; the destructive button says what it does.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><div class="rounded-overlay border border-solid border-line bg-surface p-panel-roomy shadow-overlay"><p class="mb-group text-section-title">Are you sure?</p><div class="flex justify-end gap-group"><button ui-button variant="danger">Yes</button><button ui-button variant="quiet">No</button></div></div></div>
          <p class="text-body">"Are you sure?" names nothing, and "Yes" and "No" do not say what happens.</p>
        </section>
      </div>`,
  }),
};

export const CancelTakesFocusAndConfirmEmits: Story = {
  render: () => ({
    props: { open: false, confirmed: 0 },
    template: `<div class="p-panel"><button ui-button variant="danger" (click)="open = true">Cancel booking</button><p class="mt-groups text-body" role="status">Confirmed {{ confirmed }} times</p></div><ui-confirm-dialog heading="Cancel this booking?" objectName="Architecture review, Thursday 14:00" confirmLabel="Cancel booking now" cancelLabel="Keep booking" [(open)]="open" (confirmed)="confirmed = confirmed + 1" />`,
  }),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Cancel booking' }),
    );
    const dialog = await page.findByRole('dialog');
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: 'Keep booking' }),
      ).toHaveFocus(),
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel booking now' }),
    );
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Confirmed 1 times',
    );
  },
};
