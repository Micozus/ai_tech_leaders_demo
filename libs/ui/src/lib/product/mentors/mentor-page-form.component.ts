import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
import {
  FormSubmitState,
  focusFirstInvalid,
} from '../../helpers/form-submit.helper';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';
import { STACK_TAGS, type StackTag } from '../models/product.model';

export interface MentorPageValue {
  readonly publicWorkUrl: string;
  readonly description: string;
  readonly tags: readonly StackTag[];
}

export function validateMentorPage(
  value: MentorPageValue,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value.publicWorkUrl.trim())
    errors['publicWorkUrl'] = 'Add a link to your public work.';
  else if (!value.publicWorkUrl.trim().startsWith('https://'))
    errors['publicWorkUrl'] = 'Use a link that starts with https://';
  if (value.tags.length === 0)
    errors['tags'] = 'Choose at least one stack tag.';
  return errors;
}

/** The mentor page: a link to public work, a plain description, stack tags. No ratings (N02). Form pattern (E02-S02). */
@Component({
  selector: 'ui-mentor-page-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    FieldComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  template: `
    <ui-card heading="Your mentor page" density="roomy">
      <form novalidate (submit)="submit($event)">
        @if (state.formError(); as message) {
          <div class="mb-groups">
            <ui-alert tone="danger">{{ message }}</ui-alert>
          </div>
        }
        @if (state.status() === 'success') {
          <div class="mb-groups">
            <ui-alert tone="success" heading="Mentor page saved"
              >Mentees can now find you.</ui-alert
            >
          </div>
        }
        <ui-field
          label="Link to your public work"
          controlId="mp-work"
          [error]="error('publicWorkUrl')"
          hint="A repository, a talk or a package you maintain."
        >
          <input
            ui-text-field
            id="mp-work"
            type="url"
            [invalid]="!!error('publicWorkUrl')"
            [value]="publicWorkUrl()"
            (input)="publicWorkUrl.set($any($event.target).value)"
            (blur)="touch('publicWorkUrl')"
          />
        </ui-field>
        <ui-field
          label="About you"
          controlId="mp-about"
          [optional]="true"
          hint="Plain text: what you mentor on and how you work."
        >
          <textarea
            ui-textarea
            id="mp-about"
            rows="4"
            [value]="description()"
            (input)="description.set($any($event.target).value)"
          ></textarea>
        </ui-field>
        <fieldset
          class="m-0 mb-groups min-w-0 border-0 p-0"
          [attr.aria-describedby]="error('tags') ? 'mp-tags-error' : null"
        >
          <legend class="mb-group p-0 text-label text-ink">Stack tags</legend>
          <div class="grid gap-group">
            @for (tag of tags; track tag) {
              <label ui-checkbox>
                <input
                  type="checkbox"
                  [checked]="chosen().includes(tag)"
                  [attr.aria-invalid]="error('tags') ? 'true' : null"
                  (change)="toggle(tag)"
                  (blur)="touch('tags')"
                />
                {{ tag }}
              </label>
            }
          </div>
          @if (error('tags'); as message) {
            <p
              id="mp-tags-error"
              class="mt-group flex items-start gap-group text-meta text-danger"
              role="alert"
            >
              <i
                class="pi pi-exclamation-triangle mt-0.5 shrink-0"
                aria-hidden="true"
              ></i
              ><span>{{ message }}</span>
            </p>
          }
        </fieldset>
        <button
          ui-button
          type="submit"
          [loading]="state.status() === 'submitting'"
        >
          Save mentor page
        </button>
      </form>
    </ui-card>
  `,
})
export class MentorPageFormComponent {
  readonly submitter =
    input.required<(value: MentorPageValue) => Promise<SubmitOutcome>>();
  readonly saved = output<void>();

  protected readonly tags = STACK_TAGS;
  protected readonly publicWorkUrl = signal('');
  protected readonly description = signal('');
  protected readonly chosen = signal<readonly StackTag[]>([]);
  protected readonly state = new FormSubmitState();
  readonly #touched = signal<ReadonlySet<string>>(new Set());
  readonly #submitted = signal(false);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  protected touch(name: string): void {
    this.#touched.update((set) => new Set(set).add(name));
  }

  protected toggle(tag: StackTag): void {
    this.chosen.update((list) =>
      list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag],
    );
    this.touch('tags');
  }

  protected error(name: string): string {
    const local = validateMentorPage(this.#value())[name] ?? '';
    const shown = this.#submitted() || this.#touched().has(name) ? local : '';
    return shown || this.state.fieldErrors()[name] || '';
  }

  #value(): MentorPageValue {
    return {
      publicWorkUrl: this.publicWorkUrl(),
      description: this.description(),
      tags: this.chosen(),
    };
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.#submitted.set(true);
    if (Object.keys(validateMentorPage(this.#value())).length > 0) {
      afterNextRender(() => focusFirstInvalid(this.#host.nativeElement), {
        injector: this.#injector,
      });
      return;
    }
    await this.state.submit(() => this.submitter()(this.#value()));
    if (this.state.status() === 'success') this.saved.emit();
    else
      afterNextRender(() => focusFirstInvalid(this.#host.nativeElement), {
        injector: this.#injector,
      });
  }
}
