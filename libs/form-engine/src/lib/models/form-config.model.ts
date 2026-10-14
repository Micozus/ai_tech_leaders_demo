export interface FormFieldConfig {
  key: string;
  label: string;
  required: boolean;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  submitLabel: string;
}

export type FormValue = Record<string, string>;
