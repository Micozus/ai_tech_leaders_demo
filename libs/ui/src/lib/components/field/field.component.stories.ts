import type { Meta, StoryObj } from '@storybook/angular';
import { FieldComponent } from './field.component';

const meta: Meta<FieldComponent> = {
  title: 'UI/Field',
  component: FieldComponent,
  render: (args) => ({
    props: args,
    template: `<ui-field [label]="label" [controlId]="controlId" [hint]="hint" [error]="error"><input [id]="controlId" class="w-full rounded-md border border-solid border-line bg-surface px-3.5 py-3 text-ink" /></ui-field>`,
  }),
  args: { label: 'Email', controlId: 'email', hint: '', error: '' },
};
export default meta;

type Story = StoryObj<FieldComponent>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'We never share it.' } };
export const WithError: Story = { args: { error: 'Enter a valid email.' } };
