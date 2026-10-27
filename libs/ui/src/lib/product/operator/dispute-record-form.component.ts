import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import {
  RadioComponent,
  RadioGroupComponent,
} from '../../components/radio-group/radio-group.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';

export type DisputeOutcome =
  'refund-by-hand' | 'no-refund' | 'mentor-asked-to-redo';

export interface DisputeRecord {
  readonly outcome: DisputeOutcome;
  readonly notes: string;
}

/** Operator: record how a quality dispute was resolved (E05-S03). There is no automatic refund (R09); a refund is paid by hand and written down here. */
@Component({
  selector: 'ui-dispute-record-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    CardComponent,
    FieldComponent,
    RadioComponent,
    RadioGroupComponent,
    TextareaComponent,
  ],
  template: `
    <ui-card heading="Record the outcome" density="roomy">
      <form novalidate (submit)="record($event)">
        <fieldset ui-radio-group class="mb-groups">
          <legend>Outcome</legend>
          <label ui-radio
            ><input
              type="radio"
              name="dr-outcome"
              [checked]="outcome() === 'refund-by-hand'"
              (change)="outcome.set('refund-by-hand')"
            />
            Refund paid by hand</label
          >
          <label ui-radio
            ><input
              type="radio"
              name="dr-outcome"
              [checked]="outcome() === 'no-refund'"
              (change)="outcome.set('no-refund')"
            />
            No refund</label
          >
          <label ui-radio
            ><input
              type="radio"
              name="dr-outcome"
              [checked]="outcome() === 'mentor-asked-to-redo'"
              (change)="outcome.set('mentor-asked-to-redo')"
            />
            Mentor asked to redo the answer</label
          >
        </fieldset>
        <ui-field
          label="Notes for the shared operator note"
          controlId="dr-notes"
          [error]="
            shown() && !notes().trim() ? 'Write what you decided and why.' : ''
          "
        >
          <textarea
            ui-textarea
            id="dr-notes"
            rows="4"
            [invalid]="shown() && !notes().trim()"
            [value]="notes()"
            (input)="notes.set($any($event.target).value)"
          ></textarea>
        </ui-field>
        <button ui-button type="submit">Record outcome</button>
      </form>
    </ui-card>
  `,
})
export class DisputeRecordFormComponent {
  readonly recorded = output<DisputeRecord>();

  protected readonly outcome = signal<DisputeOutcome>('no-refund');
  protected readonly notes = signal('');
  protected readonly shown = signal(false);

  protected record(event: Event): void {
    event.preventDefault();
    this.shown.set(true);
    if (!this.notes().trim()) return;
    this.recorded.emit({ outcome: this.outcome(), notes: this.notes().trim() });
  }
}
