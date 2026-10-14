import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { buildFormGroup, trimFormValue } from '../../helpers/form-group.helper';
import { FormConfig, FormValue } from '../../models/form-config.model';

@Component({
  selector: 'fe-form-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  template: `
    <form
      class="form-renderer"
      [formGroup]="form()"
      (ngSubmit)="submit()"
      data-testid="form-renderer"
    >
      @for (field of config().fields; track field.key) {
        <label class="form-renderer__field">
          <span class="form-renderer__label">{{ field.label }}</span>
          <input
            pInputText
            [formControlName]="field.key"
            [attr.data-testid]="'field-' + field.key"
          />
        </label>
      }
      <p-button
        type="submit"
        [label]="config().submitLabel"
        [disabled]="form().invalid"
        data-testid="form-submit"
      />
    </form>
  `,
  styleUrl: './_form-renderer.scss',
})
export class FormRendererComponent {
  readonly config = input.required<FormConfig>();
  readonly submitted = output<FormValue>();

  protected readonly form = computed(() => buildFormGroup(this.config()));

  protected submit(): void {
    const form = this.form();
    if (form.invalid) return;
    this.submitted.emit(trimFormValue(form.getRawValue()));
    form.reset();
  }
}
