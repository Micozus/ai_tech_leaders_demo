import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog.component';

const BODY = `<p class="text-body">Mentees can book the slots you publish. You can unpublish a slot until it is booked.</p>`;
const FOOTER = `<div uiDialogFooter class="flex flex-wrap justify-end gap-group"><button ui-button variant="quiet" type="button" (click)="open = false">Not now</button><button ui-button type="button" (click)="open = false">Publish slots</button></div>`;

const meta: Meta<DialogComponent> = {
  decorators: [moduleMetadata({ imports: [DialogComponent, ButtonComponent] })],
  title: 'Primitives/Dialog',
  component: DialogComponent,
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    props: { ...args, open: true },
    template: `<ui-dialog [heading]="heading" [(open)]="open">${BODY}${FOOTER}</ui-dialog>`,
  }),
  args: { heading: 'Publish these slots?' },
};
export default meta;

type Story = StoryObj<DialogComponent>;

export const Playground: Story = {};

/** The open state. The closed state is the page itself, with the button that opens it. */
export const StateMatrix: Story = {};

export const LongText: Story = {
  render: () => ({
    props: { open: true },
    template: `<ui-dialog heading="Publish all twenty-four slots for the next two weeks, including the ones that start before nine in the morning in your time zone?" [(open)]="open"><p class="text-body">Mentees in other time zones will see these slots in their own time. A slot must start at least two hours after it is booked, so the earliest slot a mentee can book is always two hours from now. You can unpublish a slot at any time until it is booked, and a booked slot can only be cancelled by the mentee or by the operators.</p>${FOOTER}</ui-dialog>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    props: { open: true },
    template: `<ui-dialog heading="Publish these slots?" [(open)]="open">${BODY}${FOOTER}</ui-dialog>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-overlay border border-solid border-line bg-surface p-panel-roomy shadow-overlay"><p class="mb-group text-section-title">Publish these slots?</p><p class="mb-groups text-body">Mentees can book them.</p><div class="flex justify-end gap-group"><button ui-button variant="quiet">Not now</button><button ui-button>Publish slots</button></div></div>
          <p class="text-body">A question, the consequence, and buttons that name the action.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-overlay border border-solid border-line bg-surface p-panel-roomy shadow-overlay"><p class="mb-group text-section-title">Are you sure?</p><div class="flex justify-end gap-group"><button ui-button variant="quiet">Cancel</button><button ui-button>OK</button></div></div>
          <p class="text-body">"Are you sure?" with "OK" hides what will happen. Use a page, not a dialog, for a long form.</p>
        </section>
      </div>`,
  }),
};

export const OpensTrapsFocusAndCloses: Story = {
  render: () => ({
    props: { open: false },
    template: `<div class="p-panel"><button ui-button (click)="open = true">Publish slots</button></div><ui-dialog heading="Publish these slots?" [(open)]="open">${BODY}${FOOTER}</ui-dialog>`,
  }),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Publish slots',
    });
    await userEvent.click(trigger);
    const dialog = await page.findByRole('dialog');
    await expect(dialog).toHaveTextContent('Publish these slots?');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
