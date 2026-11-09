import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';

export const NOTE_MIN_LENGTH = 40;

/**
 * The mentor drafts the note and sends it for approval (E04-S03, R12). When the mentee declined, their
 * comment shows first. The note is not published by this step: the mentee decides (N02, E04-S04).
 */
@Component({
  selector: 'ui-note-draft',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    FieldComponent,
    TextareaComponent,
  ],
  template: `
    <ui-card heading="Session note" density="roomy">
      @if (menteeComment(); as comment) {
        <div class="mb-groups">
          <ui-alert tone="info" heading="The mentee asked for changes">{{
            comment
          }}</ui-alert>
        </div>
      }
      <form novalidate (submit)="submit($event)">
        <ui-field
          label="Note"
          controlId="nd-note"
          [error]="shown() ? error() : ''"
          hint="Write what you would want to find again. The mentee approves it before it is kept."
        >
          <textarea
            ui-textarea
            id="nd-note"
            rows="6"
            [invalid]="shown() && !!error()"
            [value]="text()"
            (input)="text.set($any($event.target).value)"
          ></textarea>
        </ui-field>
        <button ui-button type="submit">Send for approval</button>
      </form>
    </ui-card>
  `,
})
export class NoteDraftComponent {
  readonly initial = input('');
  readonly menteeComment = input('');
  readonly sent = output<string>();

  protected readonly text = linkedSignal(() => this.initial());
  protected readonly shown = signal(false);

  protected error(): string {
    return this.text().trim().length < NOTE_MIN_LENGTH
      ? `Write at least ${NOTE_MIN_LENGTH} characters so the note is useful later.`
      : '';
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.shown.set(true);
    if (this.error()) return;
    this.sent.emit(this.text().trim());
  }
}
