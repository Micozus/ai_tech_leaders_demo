import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldComponent } from '../field/field.component';
import { TextFieldComponent } from './text-field.component';

const meta: Meta<TextFieldComponent> = {
  decorators: [
    moduleMetadata({ imports: [TextFieldComponent, FieldComponent] }),
  ],
  title: 'Primitives/Text field',
  component: TextFieldComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Public-work link" controlId="work"><input ui-text-field id="work" type="url" placeholder="https://github.com/your-name" [invalid]="invalid" /></ui-field></div>`,
  }),
};
export default meta;

type Story = StoryObj<TextFieldComponent>;

export const Playground: Story = { args: { invalid: false } };
export const Invalid: Story = { args: { invalid: true } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-field label="Default" controlId="s1"><input ui-text-field id="s1" value="Review my pull request" /></ui-field>
        <ui-field label="Placeholder" controlId="s2"><input ui-text-field id="s2" placeholder="https://github.com/your-name" /></ui-field>
        <ui-field label="Hover" controlId="s3"><input ui-text-field id="s3" value="Review my pull request" data-preview-state="hover" /></ui-field>
        <ui-field label="Focus" controlId="s4"><input ui-text-field id="s4" value="Review my pull request" data-preview-state="focus" /></ui-field>
        <ui-field label="Disabled" controlId="s5" hint="Disabled: the price is set by the operator for this mentor."><input ui-text-field id="s5" value="€45.00" disabled /></ui-field>
        <ui-field label="Invalid" controlId="s6" error="Enter a link that starts with https://"><input ui-text-field id="s6" value="github" [invalid]="true" aria-describedby="s6-error" /></ui-field>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Public-work link" controlId="long"><input ui-text-field id="long" value="https://github.com/acme-engineering/billing-service/pull/412/files#diff-0123456789abcdef" /></ui-field></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-field label="Public-work link" controlId="narrow"><input ui-text-field id="narrow" placeholder="https://github.com/your-name" /></ui-field></div>`,
  }),
};

export const TypeAndInvalid: Story = {
  render: () => ({
    props: {
      invalid: false,
      check(this: { invalid: boolean }, value: string) {
        this.invalid = !value.startsWith('https://');
      },
    },
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Public-work link" controlId="t"><input ui-text-field id="t" [invalid]="invalid" (input)="check($any($event.target).value)" /></ui-field></div>`,
  }),
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText('Public-work link');
    await userEvent.type(field, 'github');
    await expect(field).toHaveValue('github');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await userEvent.clear(field);
    await userEvent.type(field, 'https://github.com/ada');
    await expect(field).not.toHaveAttribute('aria-invalid');
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="Public-work link" controlId="dd1"><input ui-text-field id="dd1" placeholder="https://github.com/your-name" /></ui-field></div>
          <p class="text-body">The label is always visible; the placeholder is only an example.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><input ui-text-field aria-label="Public-work link" placeholder="Public-work link" /></div>
          <p class="text-body">The placeholder is the only name: it disappears when you type and is easy to miss.</p>
        </section>
      </div>`,
  }),
};
