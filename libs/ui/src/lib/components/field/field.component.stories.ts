import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TextFieldComponent } from '../text-field/text-field.component';
import { FieldComponent } from './field.component';

const meta: Meta<FieldComponent> = {
  decorators: [
    moduleMetadata({ imports: [FieldComponent, TextFieldComponent] }),
  ],
  title: 'Primitives/Field',
  component: FieldComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-field [label]="label" [controlId]="controlId" [hint]="hint" [error]="error" [optional]="optional"><input ui-text-field [id]="controlId" [invalid]="!!error" /></ui-field></div>`,
  }),
  args: {
    label: 'Display name',
    controlId: 'name',
    hint: '',
    error: '',
    optional: false,
  },
};
export default meta;

type Story = StoryObj<FieldComponent>;

export const Playground: Story = {};
export const WithHint: Story = { args: { hint: 'Shown on your mentor page.' } };
export const WithError: Story = { args: { error: 'Enter your name.' } };
export const Optional: Story = {
  args: { label: 'Public-work link', controlId: 'work', optional: true },
};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-field label="Display name" controlId="f1"><input ui-text-field id="f1" /></ui-field>
        <ui-field label="Public-work link" controlId="f2" [optional]="true"><input ui-text-field id="f2" type="url" /></ui-field>
        <ui-field label="Display name" controlId="f3" hint="Shown on your mentor page."><input ui-text-field id="f3" /></ui-field>
        <ui-field label="Display name" controlId="f4" error="Enter your name."><input ui-text-field id="f4" [invalid]="true" /></ui-field>
        <ui-field label="Price" controlId="f5" hint="Disabled: the price is set by the operator for this mentor."><input ui-text-field id="f5" value="€45.00" disabled /></ui-field>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><ui-field label="Link to your public work: a repository, a pull request, a talk or a package you maintain" controlId="l1" error="Enter a link that starts with https:// and points to a page that does not need a sign-in."><input ui-text-field id="l1" [invalid]="true" /></ui-field></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-field label="Display name" controlId="n1" hint="Shown on your mentor page." error="Enter your name."><input ui-text-field id="n1" [invalid]="true" /></ui-field></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="Public-work link" controlId="dd1" [optional]="true" hint="A repository, a talk or a package."><input ui-text-field id="dd1" type="url" /></ui-field></div>
          <p class="text-body">Mark only what is optional, and put the hint under the label.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="Public-work link *" controlId="dd2"><input ui-text-field id="dd2" type="url" [invalid]="true" /></ui-field></div>
          <p class="text-body">A red asterisk marks the required field by colour and symbol only, and an error border has no error text.</p>
        </section>
      </div>`,
  }),
};

export const DescribesTheControl: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Display name" controlId="d1" hint="Shown on your mentor page." error="Enter your name."><input ui-text-field id="d1" [invalid]="true" /></ui-field></div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Display name');
    await expect(input).toHaveAttribute('aria-describedby', 'd1-hint d1-error');
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Enter your name.',
    );
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};
