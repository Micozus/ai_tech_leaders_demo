import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import { formatSlot } from '../models/format.helper';
import type { Slot } from '../models/product.model';

export interface NewSlot {
  readonly date: string;
  readonly time: string;
}

/** The mentor's published slots, free or booked, and a row to add one (E02-S03). Dense rows on a 1px line (R01.1). */
@Component({
  selector: 'ui-slot-publisher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncRegionComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    FieldComponent,
    TextFieldComponent,
  ],
  template: `
    <ui-card heading="Your slots">
      <ui-async-region
        [state]="state()"
        loadingLabel="Loading your slots"
        emptyHeading="No slots yet"
        emptyDescription="Publish a slot so mentees can book you."
        errorHeading="Your slots did not load"
      >
        <ul class="m-0 list-none p-0">
          @for (slot of slots(); track slot.id) {
            <li
              class="flex items-center justify-between gap-groups border-t border-solid border-line py-row-y first:border-t-0"
            >
              <span class="text-body">{{ label(slot) }}</span>
              <span class="flex items-center gap-group">
                <ui-badge
                  [tone]="slot.state === 'free' ? 'success' : 'neutral'"
                  >{{ slot.state === 'free' ? 'Free' : 'Booked' }}</ui-badge
                >
                @if (slot.state === 'free') {
                  <button
                    ui-button
                    variant="ghost"
                    size="sm"
                    type="button"
                    [attr.aria-label]="'Unpublish ' + label(slot)"
                    (click)="unpublish.emit(slot.id)"
                  >
                    Unpublish
                  </button>
                }
              </span>
            </li>
          }
        </ul>
        <button
          uiErrorAction
          ui-button
          variant="quiet"
          type="button"
          (click)="retry.emit()"
        >
          Try again
        </button>
      </ui-async-region>
      <form
        class="mt-groups flex flex-wrap items-end gap-group"
        (submit)="add($event)"
      >
        <ui-field label="Date" controlId="sp-date"
          ><input
            ui-text-field
            id="sp-date"
            type="date"
            required
            [value]="date()"
            (input)="date.set($any($event.target).value)"
        /></ui-field>
        <ui-field label="Time" controlId="sp-time"
          ><input
            ui-text-field
            id="sp-time"
            type="time"
            required
            [value]="time()"
            (input)="time.set($any($event.target).value)"
        /></ui-field>
        <div class="mb-groups">
          <button ui-button type="submit">Publish slot</button>
        </div>
      </form>
    </ui-card>
  `,
})
export class SlotPublisherComponent {
  readonly slots = input<readonly Slot[]>([]);
  readonly state = input<AsyncState>('ready');
  readonly timeZone = input('Europe/Warsaw');
  readonly publish = output<NewSlot>();
  readonly unpublish = output<string>();
  readonly retry = output<void>();

  protected readonly date = signal('');
  protected readonly time = signal('');

  protected label(slot: Slot): string {
    return formatSlot(slot.startsAt, this.timeZone());
  }

  protected add(event: Event): void {
    event.preventDefault();
    if (!this.date() || !this.time()) return;
    this.publish.emit({ date: this.date(), time: this.time() });
  }
}
