import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { SLOTS } from '../../.storybook/blocks/sample-data';
import { ToastComponent } from '../lib/components/toast/toast.component';
import { ToastService } from '../lib/services/toast/toast.service';
import {
  SlotPublisherComponent,
  type NewSlot,
} from '../lib/product/mentors/slot-publisher.component';
import type { Slot } from '../lib/product/models/product.model';

@Component({
  selector: 'ui-doc-slot-publication',
  imports: [SlotPublisherComponent, ToastComponent],
  template: `
    <div class="max-w-measure p-panel-roomy" style="min-height: 28rem">
      <ui-slot-publisher
        [slots]="slots"
        timeZone="UTC"
        (publish)="publish($event)"
        (unpublish)="unpublish($event)"
      />
      <ui-toast />
    </div>
  `,
})
class SlotPublicationComponent {
  readonly #toast = inject(ToastService);
  protected slots: readonly Slot[] = SLOTS.filter((s) => s.id !== 'soon');

  protected publish({ date, time }: NewSlot): void {
    this.slots = [
      ...this.slots,
      { id: `${date}T${time}`, startsAt: `${date}T${time}:00Z`, state: 'free' },
    ];
    this.#toast.show({
      tone: 'success',
      summary: 'Slot published',
      detail: `${date} ${time}`,
    });
  }

  protected unpublish(id: string): void {
    this.slots = this.slots.filter((s) => s.id !== id);
    this.#toast.show({ tone: 'info', summary: 'Slot unpublished' });
  }
}

const meta: Meta = {
  decorators: [moduleMetadata({ imports: [SlotPublicationComponent] })],
  title: 'Patterns/Slot publication',
  render: () => ({ template: `<ui-doc-slot-publication />` }),
};
export default meta;

type Story = StoryObj;

export const PublishedSlotsList: Story = {};

export const PublishingAddsTheSlotAndConfirmsInAToast: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.type(canvas.getByLabelText('Date'), '2026-11-12');
    await userEvent.type(canvas.getByLabelText('Time'), '10:00');
    await userEvent.click(canvas.getByRole('button', { name: 'Publish slot' }));
    await waitFor(() =>
      expect(canvas.getAllByRole('listitem')).toHaveLength(4),
    );
    await waitFor(() =>
      expect(page.getByRole('alert')).toHaveTextContent('Slot published'),
    );
  },
};

export const OnlyAFreeSlotCanBeUnpublished: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getAllByRole('button', { name: /Unpublish/ }),
    ).toHaveLength(2);
    await userEvent.click(
      canvas.getAllByRole('button', { name: /Unpublish/ })[0],
    );
    await waitFor(() =>
      expect(canvas.getAllByRole('listitem')).toHaveLength(2),
    );
  },
};
