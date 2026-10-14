import { FormConfig } from '@org/form-engine';

export const ADD_TASK_FORM: FormConfig = {
  submitLabel: 'Add task',
  fields: [{ key: 'title', label: 'Title', required: true }],
};

export const TASK_TITLE_KEY = 'title';
