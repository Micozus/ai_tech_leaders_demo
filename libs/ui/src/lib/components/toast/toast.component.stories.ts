import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Component, inject } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { ToastService } from '../../services/toast/toast.service';
import { ToastComponent } from './toast.component';

const meta: Meta<ToastComponent> = {
  decorators: [moduleMetadata({ imports: [ToastComponent, ButtonComponent] })],
  title: 'Primitives/Toast',
  component: ToastComponent,
};
export default meta;

type Story = StoryObj<ToastComponent>;

@Component({
  selector: 'ui-doc-toast-trigger',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap gap-group">
      <button ui-button variant="quiet" type="button" (click)="success()">
        Copy share link
      </button>
      <button ui-button variant="quiet" type="button" (click)="info()">
        Show info
      </button>
    </div>
  `,
})
class ToastTriggerComponent {
  readonly #toast = inject(ToastService);
  protected success(): void {
    this.#toast.show({
      tone: 'success',
      summary: 'Share link copied',
      detail: 'Paste it anywhere you share your work.',
    });
  }
  protected info(): void {
    this.#toast.show({ tone: 'info', summary: 'Slots saved as a draft' });
  }
}

const withTrigger = (): {
  template: string;
  moduleMetadata: { imports: unknown[] };
} => ({
  template: `<div class="p-panel" style="min-height: 14rem"><ui-doc-toast-trigger /><ui-toast /></div>`,
  moduleMetadata: { imports: [ToastTriggerComponent, ToastComponent] },
});

export const Playground: Story = { render: withTrigger };

/** The two calm tones. Each appears when the matching button is pressed. */
export const StateMatrix: Story = { render: withTrigger };

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel" style="min-height: 14rem; width: 24rem"><ui-doc-toast-trigger /><ui-toast /></div>`,
    moduleMetadata: { imports: [ToastTriggerComponent, ToastComponent] },
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: withTrigger,
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><p class="text-body">After copying the link: a toast, "Share link copied".</p></div>
          <p class="text-body">A short confirmation that needs no action and may vanish.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><p class="text-body">After a failed payment: a toast, "Payment failed".</p></div>
          <p class="text-body">An error that needs action is never a toast: it disappears before it is read. Use an alert or an error state.</p>
        </section>
      </div>`,
  }),
};

export const AnnouncesAndShowsMessage: Story = {
  render: withTrigger,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Copy share link' }),
    );
    await waitFor(() =>
      expect(page.getByRole('alert')).toHaveTextContent('Share link copied'),
    );
  },
};
