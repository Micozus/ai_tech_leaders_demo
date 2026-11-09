import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';

export interface SessionMessage {
  readonly id: string;
  readonly author: string;
  /** Display text of the time, e.g. `14:03`. */
  readonly at: string;
  readonly text: string;
}

/**
 * The text session (E04-S01): the notice that sessions are text only comes first (N01), then the
 * conversation with the author and the time on every message (R02.2), and a composer that stays in
 * place and sends with Ctrl+Enter (R02.3). One dominant column (R02.1).
 */
@Component({
  selector: 'ui-session-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    AsyncRegionComponent,
    ButtonComponent,
    FieldComponent,
    TextareaComponent,
  ],
  template: `
    <section aria-labelledby="sp-title" class="max-w-measure">
      <h2 id="sp-title" class="mb-groups text-section-title">{{ title() }}</h2>
      <div class="mb-groups">
        <ui-alert tone="info"
          >Sessions are text only. You write, the mentor answers in writing;
          there is no call.</ui-alert
        >
      </div>
      <ui-async-region
        [state]="state()"
        loadingLabel="Loading the conversation"
        emptyHeading="No messages yet"
        emptyDescription="Describe your problem. Include the code or a link."
        errorHeading="The conversation did not load"
      >
        <ol class="m-0 grid list-none gap-groups p-0">
          @for (message of messages(); track message.id) {
            <li>
              <p class="text-meta text-muted">
                <span class="font-bold text-ink">{{ message.author }}</span> ·
                {{ message.at }}
              </p>
              <p class="max-w-measure whitespace-pre-line text-body">
                {{ message.text }}
              </p>
            </li>
          }
        </ol>
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
      <form class="mt-panel-roomy" (submit)="send($event)">
        <ui-field
          label="Your message"
          controlId="sp-message"
          [hint]="canWrite() ? 'Press Ctrl+Enter to send.' : closedReason()"
        >
          <textarea
            ui-textarea
            id="sp-message"
            rows="3"
            [disabled]="!canWrite()"
            [value]="draft()"
            (input)="draft.set($any($event.target).value)"
            (keydown)="onKey($event)"
          ></textarea>
        </ui-field>
        <button ui-button type="submit" [disabled]="!canWrite()">
          Send message
        </button>
      </form>
    </section>
  `,
})
export class SessionPanelComponent {
  readonly title = input('Architecture review with Ada Lovelace');
  readonly messages = input<readonly SessionMessage[]>([]);
  readonly state = input<AsyncState>('ready');
  readonly canWrite = input(true);
  readonly closedReason = input(
    'The session has ended, so you can no longer write here.',
  );
  readonly sent = output<string>();
  readonly retry = output<void>();

  protected readonly draft = signal('');

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey))
      this.send(event);
  }

  protected send(event: Event): void {
    event.preventDefault();
    const text = this.draft().trim();
    if (!text || !this.canWrite()) return;
    this.sent.emit(text);
    this.draft.set('');
  }
}
