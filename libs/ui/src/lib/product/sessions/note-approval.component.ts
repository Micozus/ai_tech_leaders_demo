import {
  ChangeDetectionStrategy,
  Component,
  input,
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

/**
 * The mentee approves the note in full, or declines it with a comment (E04-S04, R12). An approved note
 * is kept privately by both; nothing is published.
 */
@Component({
  selector: 'ui-note-approval',
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
    <ui-card heading="Note from {{ author() }}" density="roomy">
      <p class="mb-groups max-w-measure whitespace-pre-line text-body-long">
        {{ note() }}
      </p>
      <form novalidate (submit)="submit($event)">
        <fieldset ui-radio-group class="mb-groups">
          <legend>Your decision</legend>
          <label ui-radio
            ><input
              type="radio"
              name="na-choice"
              [checked]="choice() === 'approve'"
              (change)="choice.set('approve')"
            />
            Approve the whole note. We both keep it privately; nothing is
            published.</label
          >
          <label ui-radio
            ><input
              type="radio"
              name="na-choice"
              [checked]="choice() === 'decline'"
              (change)="choice.set('decline')"
            />
            Decline it and ask the mentor to rewrite it</label
          >
        </fieldset>
        @if (choice() === 'decline') {
          <ui-field
            label="Comment for the mentor"
            controlId="na-comment"
            [error]="
              shown() && !comment().trim()
                ? 'Say what to change, so the mentor can rewrite the note.'
                : ''
            "
          >
            <textarea
              ui-textarea
              id="na-comment"
              rows="3"
              [invalid]="shown() && !comment().trim()"
              [value]="comment()"
              (input)="comment.set($any($event.target).value)"
            ></textarea>
          </ui-field>
        }
        <button ui-button type="submit">
          {{ choice() === 'decline' ? 'Send comment' : 'Approve note' }}
        </button>
      </form>
    </ui-card>
  `,
})
export class NoteApprovalComponent {
  readonly author = input('Ada Lovelace');
  readonly note = input.required<string>();
  readonly approved = output<void>();
  readonly declined = output<string>();

  protected readonly choice = signal<'approve' | 'decline'>('approve');
  protected readonly comment = signal('');
  protected readonly shown = signal(false);

  protected submit(event: Event): void {
    event.preventDefault();
    if (this.choice() === 'approve') {
      this.approved.emit();
      return;
    }
    this.shown.set(true);
    if (!this.comment().trim()) return;
    this.declined.emit(this.comment().trim());
  }
}
