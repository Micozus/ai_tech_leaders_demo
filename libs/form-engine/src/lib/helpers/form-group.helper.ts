import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FormConfig,
  FormFieldConfig,
  FormValue,
} from '../models/form-config.model';

export type RendererFormGroup = FormGroup<Record<string, FormControl<string>>>;

function buildControl(field: FormFieldConfig): FormControl<string> {
  const validators = field.required ? [Validators.required] : [];
  return new FormControl('', { nonNullable: true, validators });
}

export function buildFormGroup(config: FormConfig): RendererFormGroup {
  const controls: Record<string, FormControl<string>> = {};
  for (const field of config.fields) {
    controls[field.key] = buildControl(field);
  }
  return new FormGroup(controls);
}

export function trimFormValue(value: FormValue): FormValue {
  const trimmed: FormValue = {};
  for (const [key, entry] of Object.entries(value)) {
    trimmed[key] = entry.trim();
  }
  return trimmed;
}
